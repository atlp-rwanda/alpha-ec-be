/* eslint-disable prefer-destructuring */
import { Request, Response } from 'express';
import { Op } from 'sequelize';
import database from '../database';
import { sendResponse } from '../utils';
import { Product } from '../database/models/product';
import { CheckUserCredential } from '../middleware/statuscheck';

export const getProductStats = async (req: Request, res: Response) => {
  try {
    const user = await CheckUserCredential(req);
    let { startDate, endDate } = req.query;

    if (!startDate) {
      throw new Error('Start date is required.');
    }

    startDate = new Date(startDate as string).toISOString().split('T')[0];

    let sellerCondition = {};

    if (user && user.role === 'seller') {
      sellerCondition = { sellerId: user.id };
    }

    const dataRange = {
      createdAt: {
        [Op.gte]: new Date(startDate as string),
        [Op.lte]: new Date(endDate as string),
      },
      ...sellerCondition,
    };

    if (endDate) {
      endDate = new Date(endDate as string).toISOString().split('T')[0];
      dataRange.createdAt[Op.lte] = new Date(endDate);
    } else {
      dataRange.createdAt[Op.lte] = new Date();
    }

    const newProducts = await database.Product.count({
      where: dataRange,
    });

    const expiredProducts = await database.Product.count({
      where: {
        ...dataRange,
        expired: true,
      },
    });

    const stockUpdates = await database.Product.findAll({
      attributes: ['status'],
      where: dataRange,
    });

    let stockIncrement: number = 0;
    let stockReduction: number = 0;

    stockUpdates.forEach((product: Product) => {
      if (product.status === true) {
        stockIncrement += 1;
      } else {
        stockReduction += 1;
      }
    });

    const productWished = await database.Product.count({
      include: [
        {
          model: database.Wishlist,
          as: 'wishlist',
          required: true,
        },
      ],
      where: dataRange,
    });

    const stats = {
      newProducts,
      expiredProducts,
      stockIncrement,
      stockReduction,
      productWished,
    };

    sendResponse(res, 200, { stats }, 'Statistics are fetched successfully');
  } catch (err: unknown) {
    const errors = err as Error;
    return sendResponse<null>(res, 500, null, errors.message);
  }
};
