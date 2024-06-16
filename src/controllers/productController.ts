import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Product, ProductAttributes } from '../database/models/product';
import { sendResponse } from '../utils/response';
import Database from '../database';
import { deleteCloudinaryFile } from '../utils';
import { uploadImages } from '../middleware';
import { buildQuery, excOperation } from '../helper';
import { CategoryAttributes } from '../database/models/category';
import { CheckUserCredential } from '../middleware/statuscheck';

interface ProductCreationAttributes extends Omit<ProductAttributes, 'id'> {}
export interface UserInterface {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const createAProduct = async (
  req: Request<object, object, ProductCreationAttributes>,
  res: Response
) => {
  try {
    const {
      name,
      price,
      categoryId,
      expiryDate,
      bonus,
      status,
      quantity,
      description,
    } = req.body;

    const user = req.user as UserInterface;
    const sellerId = user.id;

    const query = {
      where: {
        [Op.and]: [{ name }, { sellerId }],
      },
    };

    const productExist: ProductAttributes | null =
      await excOperation<ProductAttributes>('Product', 'findOne', query);

    if (productExist) {
      return sendResponse<ProductCreationAttributes>(
        res,
        200,
        productExist,
        'Product already exists, update instead!'
      );
    }

    const catQuery = {
      where: {
        id: categoryId,
      },
    };
    const categoryExist: CategoryAttributes | null =
      await excOperation<CategoryAttributes>('Category', 'findOne', catQuery);

    if (!categoryExist) {
      return sendResponse<null>(res, 400, null, 'Category does not exists!');
    }

    const images = await uploadImages();

    const slug = `${name.split(' ').join('-')}-${sellerId.slice(0, 7)}`;

    const product = Database.Product.build({
      name,
      slug,
      images,
      price,
      categoryId,
      expiryDate,
      bonus,
      status: status || false,
      quantity: quantity || 0,
      description: description || '',
      sellerId,
    });

    const result = await product.save();

    return sendResponse<ProductAttributes>(
      res,
      201,
      result,
      'Product created successfully!'
    );
  } catch (err: unknown) {
    const errors = err as Error;
    return sendResponse<null>(res, 500, null, errors.message);
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    req.user = await CheckUserCredential(req);
    const query = buildQuery(req);
    const products = await excOperation<ProductAttributes[]>(
      'Product',
      'findAndCountAll',
      query
    );

    const { limit = 50, page = 1 } = req.query;

    return sendResponse(
      res,
      200,
      products,
      'successfully!',
      true,
      Number(limit),
      Number(page),
      'products'
    );
  } catch (err: unknown) {
    const errors = err as Error;
    return sendResponse<null>(res, 500, null, errors.message);
  }
};

export const deleteAProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;

    const user = req.user as UserInterface;
    const sellerId = user.id;

    const query = {
      where: {
        [Op.and]: [{ id: productId }, { sellerId }],
      },
    };

    const productExist: ProductAttributes | null =
      await excOperation<ProductAttributes>('Product', 'findOne', query);

    if (productExist) {
      const { images } = productExist;

      const deleteImages = images.map(async image => {
        await deleteCloudinaryFile(image.split('/')[7].split('.')[0]);
      });

      await Promise.all(deleteImages);

      const result: number = await excOperation<number>(
        'Product',
        'destroy',
        query
      );
      if (result !== 0) {
        return sendResponse(res, 200, null, 'Product deleted successfully!');
      }
    } else {
      return sendResponse<null>(res, 404, null, 'Product not found or owned!');
    }
  } catch (err: unknown) {
    const errors = err as Error;
    return sendResponse<null>(res, 500, null, errors.message);
  }
};

export const getAProduct = async (req: Request, res: Response) => {
  try {
    req.user = await CheckUserCredential(req);

    const productId = req.params.id;
    const user = req.user as UserInterface;

    let product: ProductAttributes;

    if (user && user.role === 'seller') {
      const sellerId = user.id;

      const query = {
        where: { [Op.and]: [{ id: productId }, { sellerId }] },
        include: [
          {
            model: Database.User,
            as: 'seller',
            attributes: ['id', 'name', 'phone', 'email'],
          },
          {
            model: Database.Category,
            as: 'category',
            attributes: ['id', 'name'],
          },
        ],
      };

      product = await excOperation<ProductAttributes>(
        'Product',
        'findOne',
        query
      );
    } else {
      const query = {
        where: { id: productId },
        include: [
          {
            model: Database.User,
            as: 'seller',
            attributes: ['id', 'name', 'phone', 'email'],
          },
          {
            model: Database.Category,
            as: 'category',
            attributes: ['id', 'name'],
          },
        ],
      };

      product = await excOperation<ProductAttributes>(
        'Product',
        'findOne',
        query
      );
    }

    if (!product) {
      return sendResponse<null>(res, 404, null, 'Product not found!');
    }
    const relatedProductsInCategory = await excOperation<ProductAttributes[]>(
      'Product',
      'findAll',
      {
        where: {
          categoryId: product.categoryId,
          id: { [Op.ne]: productId },
        },
        include: [
          {
            model: Database.User,
            as: 'seller',
            attributes: ['id', 'name', 'phone', 'email'],
          },
          {
            model: Database.Category,
            as: 'category',
            attributes: ['id', 'name'],
          },
        ],
        limit: 4,
      }
    );

    const relatedProductsVisitedBySeller = await excOperation<
      ProductAttributes[]
    >('Product', 'findAll', {
      where: {
        sellerId: product.sellerId,
        id: { [Op.ne]: productId },
      },

      include: [
        {
          model: Database.User,
          as: 'seller',
          attributes: ['id', 'name', 'phone', 'email'],
        },
        {
          model: Database.Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
      limit: 4,
    });
    const relatedProducts = [
      ...relatedProductsInCategory,
      ...relatedProductsVisitedBySeller,
    ];

    const sellerInfo = {
      id: product.seller?.id,
      name: product.seller?.name,
      email: product.seller?.email,
      phone: product.seller?.phone,
    };
    const data = {
      product,
      relatedProducts,
      sellerInfo,
    };
    return sendResponse(res, 200, data, 'Product found successfully!');
  } catch (err: unknown) {
    const errors = err as Error;
    return sendResponse<null>(res, 500, null, errors.message);
  }
};

export const updateAProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const user = req.user as UserInterface;
    const sellerId = user.id;

    const query = {
      where: {
        [Op.and]: [{ id: productId }, { sellerId }],
      },
    };

    const productExist: ProductAttributes | null =
      await excOperation<ProductAttributes>('Product', 'findOne', query);

    if (!productExist) {
      return sendResponse<null>(res, 404, null, 'Product not found or owned!');
    }

    const fieldsToUpdate = req.body;
    if (Object.keys(fieldsToUpdate).length === 0) {
      return sendResponse<null>(
        res,
        400,
        null,
        'No fields provided to update!'
      );
    }

    const { name } = req.body;
    if (name) {
      fieldsToUpdate.slug = name.split(' ').join('-');
    }

    const result = await Database.Product.update(fieldsToUpdate, {
      where: {
        [Op.and]: [{ id: productId }, { sellerId }],
      },
    });
    if (result[0] > 0) {
      const updatedProduct: ProductAttributes = await excOperation(
        'Product',
        'findOne',
        query
      );

      return sendResponse<ProductAttributes>(
        res,
        200,
        updatedProduct,
        'Product updated successfully!'
      );
    }
  } catch (err: unknown) {
    const errors = err as Error;
    return sendResponse<null>(res, 500, null, errors.message);
  }
};

export const updateProductAvailability = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ where: { id } });
    if (!product) {
      return sendResponse<null>(res, 404, null, 'Product not found');
    }
    product.status = !product.status;
    await product.save();
    return sendResponse<ProductAttributes>(
      res,
      200,
      product,
      'Product status updated successfully!'
    );
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).json({ status: 500, success: false, message: err.message });
  }
};
