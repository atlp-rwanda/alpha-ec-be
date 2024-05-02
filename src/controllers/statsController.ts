import { Request, Response } from 'express';
import { Op } from 'sequelize';
import database from '../database';
import { sendResponse } from '../utils';
import { Product } from '../database/models/product';
import { CheckUserCredential } from '../middleware/statuscheck';

export const getProductStats = async (req: Request, res: Response) => {
  try {
    const user = await CheckUserCredential(req);
    const timeFrame = req.query.timeFrame as string;

    let startDate, endDate;
    let sellerCondition = {};

    if (timeFrame) {
      if (user && user.role === 'seller') {
        sellerCondition = { sellerId: user.id };
      }

      switch (timeFrame) {
        case 'daily':
          startDate = new Date();
          endDate = new Date();
          break;
        case 'last7days':
          startDate = new Date();
          startDate.setDate(startDate.getDate() - 7);
          endDate = new Date();
          break;
        case 'last30days':
          startDate = new Date();
          startDate.setDate(startDate.getDate() - 30);
          endDate = new Date();
          break;
        default:
          throw new Error('Invalid time frame');
      }
    }

    const dataRange = {
      ...(timeFrame && {
        createdAt: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
      }),
      ...sellerCondition,
    };

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

    sendResponse(res, 200, { stats }, 'Statistics are Fetched successfully');
  } catch (err: unknown) {
    const errors = err as Error;
    return sendResponse<null>(res, 500, null, errors.message);
  }
};
