import { Request, Response } from 'express';
import { sendResponse } from '../utils/response';
import Database from '../database/index';
import NotificationEventEmitter, { EventName } from './EventController';

interface UserInterface {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const addToWishlist = async (req: Request, res: Response) => {
  const { productId } = req.body;
  const { id, name } = req.user as UserInterface;
  try {
    const product = await Database.Product.findOne({
      where: { id: productId },
      attributes: ['sellerId', 'name'],
    });
    if (!product) {
      return sendResponse<null>(res, 404, null, 'Product not found');
    }
    if (!product.sellerId) {
      return sendResponse<null>(res, 400, null, 'Product sellerId is missing');
    }

    const productExit = await Database.Wishlist.findOne({
      where: { userId: id, productId },
      include: [
        {
          model: Database.Product,
          as: 'product',
          attributes: ['id', 'name', 'price'],
        },
      ],
    });
    if (productExit) {
      try {
        await productExit.destroy();
        NotificationEventEmitter.emit(
          EventName.PRODUCT_WISHLIST_UPDATE,
          product,
          id,
          `${name} removed the product from their wishlist(${product.name})`,
          product.sellerId
        );
        return sendResponse(
          res,
          200,
          null,
          'Wishlist item deleted successfully'
        );
      } catch (err) {
        const errors = err as Error;
        return sendResponse<null>(res, 500, null, errors.message);
      }
    }
    const wishlist = await Database.Wishlist.create({
      userId: id,
      productId,
      sellerId: product.sellerId,
    });

    NotificationEventEmitter.emit(
      EventName.PRODUCT_WISHLIST_UPDATE,
      product,
      id,
      `${name} added the product to their wishlist(${product.name})`,
      product.sellerId
    );
    return sendResponse(
      res,
      201,
      { wishlist, product },
      'Product added to wishlist'
    );
  } catch (err) {
    const errors = err as Error;
    return sendResponse<null>(res, 500, null, errors.message);
  }
};

export const getWishlist = async (req: Request, res: Response) => {
  const { id, role } = req.user as UserInterface;

  try {
    let wishlist;
    if (role === 'seller') {
      wishlist = await Database.Wishlist.findAndCountAll({
        include: [
          {
            model: Database.Product,
            as: 'product',
            where: { sellerId: id },
          },
        ],
      });
    } else if (role === 'buyer') {
      const productWishlist = await Database.Wishlist.findAll({
        where: { userId: id },
      });
      const productIds = productWishlist.map(product => product.productId);
      wishlist = await Database.Product.findAndCountAll({
        where: { id: productIds },
      });
      return sendResponse(
        res,
        200,
        { wishlist },
        'Wishlist fetched successfully'
      );
    } else {
      return sendResponse<null>(res, 403, null, 'Not authorized!');
    }
  } catch (err) {
    const errors = err as Error;
    return sendResponse<null>(res, 500, null, errors.message);
  }
};

export const clearWishlist = async (req: Request, res: Response) => {
  const { id } = req.user as UserInterface;
  try {
    await Database.Wishlist.destroy({ where: { userId: id } });
    return sendResponse(res, 200, null, 'Wishlist cleared successfully');
  } catch (err) {
    const errors = err as Error;
    return sendResponse<null>(res, 500, null, errors.message);
  }
};
