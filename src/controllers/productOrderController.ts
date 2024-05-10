import { Request, Response } from 'express';
import Database from '../database';
import { sendResponse } from '../utils/response';
import { updateOrderStatus } from '../helper';
import { UserInterface } from './productController';

//---------------------------------------------------------------------------------------------------------------------------
export const getproductorder = async (req: Request, res: Response) => {
  const { id, role } = req.user as UserInterface;
  try {
    const orderFound = await Database.ProductOrder.findAll({
      where: role === 'seller' ? { sellerId: id } : { userId: id },
      include: [
        {
          model: Database.User,
          as: 'orderBuyer',
          attributes: ['name', 'photoUrl'],
        },
        {
          model: Database.Product,
          as: 'orderedProduct',
          attributes: ['name', 'price', 'images'],
        },
      ],
    });

    return sendResponse(res, 200, orderFound, 'Product Order retrieved');
  } catch (err: unknown) {
    const errors = err as Error;
    return sendResponse<null>(res, 500, null, errors.message);
  }
};

export const updateproductorder = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const productOrder = await Database.ProductOrder.findByPk(orderId);
    if (!productOrder) {
      return sendResponse<null>(res, 404, null, 'Product order not found');
    }

    productOrder.status = status;
    await productOrder.save();
    await updateOrderStatus(productOrder.orderId as string);

    return sendResponse(res, 200, productOrder, 'Order status updated');
  } catch (err: unknown) {
    const errors = err as Error;
    return sendResponse<null>(res, 500, null, errors.message);
  }
};
