import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { ProductAttributes } from '../database/models/product';
import { sendResponse } from '../utils/response';
import Database from '../database';
import { deleteCloudinaryFile } from '../utils';
import { uploadImages } from '../middleware';
import { buildQuery, excOperation } from '../helper';

interface ProductCreationAttributes extends Omit<ProductAttributes, 'id'> {}
interface UserInterface {
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
    const { name, price, category, expiryDate, bonus, status, quantity } =
      req.body;

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

    const images = await uploadImages();

    const product = Database.Product.build({
      name,
      slug: name.split(' ').join('-'),
      images,
      price,
      category,
      expiryDate,
      bonus,
      status: status || 'available',
      quantity: quantity || 0,
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
    const productId = req.params.id;

    const query = {
      where: { id: productId },
    };

    const product: ProductAttributes = await excOperation<ProductAttributes>(
      'Product',
      'findOne',
      query
    );

    if (!product) {
      return sendResponse<null>(res, 404, null, 'Product not found!');
    }

    return sendResponse<ProductAttributes>(
      res,
      200,
      product,
      'Product found successfully!'
    );
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
