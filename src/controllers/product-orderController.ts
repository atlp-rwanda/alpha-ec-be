import { Request, Response } from 'express';
import Database from '../database';
import { UserInterface } from './productController';
import { sendResponse } from '../utils/response';

// add the product order
export const addproductorder = async (req: Request, res: Response) => {
  const { id } = req.user as UserInterface;
  try {
    const user = req.user as UserInterface;
    const userId = user.id;
    const cartFound = await Database.Cart.findOne({
      where: { userId },
    });
    console.log(cartFound?.products);
    if (!cartFound) {
      return sendResponse<null>(res, 404, null, 'the Cart is not made!');
    }
    const order = await Database.Order.build({
      userId: id,
      items: cartFound.products,
      status: 'pending',
    });
    await order.save();
    await Database.productOrder.create({
      id,
      buyerId: id,
      orders: order.id,
      status: 'pending',
    });
    await Database.Cart.destroy({ where: { userId } });
    return sendResponse(res, 200, order, 'Order created ');
  } catch (err: unknown) {
    const errors = err as Error;
    return sendResponse<null>(res, 500, null, errors.message);
  }
};

//---------------------------------------------------------------------------------------------------------------------------
export const getproductorder = async (req: Request, res: Response) => {
  const { id } = req.user as UserInterface;
  try {
    const orderFound = await Database.Order.findAll({
      where: { userId: id },
    });
    return sendResponse(res, 200, orderFound, 'order retrieved');
  } catch (err: unknown) {
    const errors = err as Error;
    return sendResponse<null>(res, 500, null, errors.message);
  }
};

// update status only if you are a isSeller in order where orderid is in params
export const updateproductorder = async (req: Request, res: Response) => {
  const { id } = req.user as UserInterface;
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    // Find the order by its primary key (orderId)
    const order = await Database.Order.findByPk(orderId);
    console.log(order);
    // Check if the order exists
    if (!order) {
      return sendResponse<null>(res, 404, null, 'order not found');
    }
    // Check if the user is authorized to update the order
    if (order.userId !== id) {
      return sendResponse<null>(res, 401, null, 'Unauthorized');
    }
    // Update the order's status
    order.status = status;
    await order.save();
    // Send a success response
    return sendResponse(res, 200, order, 'Order status updated');
  } catch (err: unknown) {
    const errors = err as Error;
    return sendResponse<null>(res, 500, null, errors.message);
  }
};
