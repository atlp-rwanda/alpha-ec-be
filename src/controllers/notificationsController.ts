import { Request, Response } from 'express';
import Database from '../database';
import { sendResponse } from '../utils';
import { UserInterface } from './productController';

const getNotifications = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserInterface;
    let notifications;
    if (user.role === 'seller') {
      notifications = await Database.Notification.findAll({
        where: {
          sellerId: user.id,
          event: ['PAYMENT_COMPLETED', 'PRODUCT_WISHLIST_UPDATE'],
        },
        include: {
          model: Database.User,
          as: 'user',
          attributes: ['name'],
        },
        attributes: ['id', 'message', 'event', 'isRead', 'createdAt'],
      });
    } else {
      notifications = await Database.Notification.findAll({
        where: {
          userId: user.id,
          event: [
            'ORDER_STATUS',
            'PAYMENT_COMPLETED',
            'STOCK_LEVEL_REACH_ZERO',
          ],
        },
        include: {
          model: Database.User,
          as: 'user',
          attributes: ['name'],
        },
        attributes: ['id', 'message', 'event', 'isRead', 'createdAt'],
      });
    }
    return sendResponse(
      res,
      200,
      notifications,
      'All notifications retrieved.'
    );
  } catch (error) {
    const errorMessage = (error as Error).message;
    return sendResponse<null>(res, 500, null, errorMessage);
  }
};

const readNotifications = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user as UserInterface;
    const condition =
      // eslint-disable-next-line no-constant-condition
      user.role === 'seller'
        ? { id, sellerId: user.id }
        : { id, userId: user.id };

    const notification = await Database.Notification.findOne({
      where: condition,
    });

    if (!notification) {
      return sendResponse(res, 404, null, 'Notification not found.');
    }
    const newIsReadStatus = !notification.isRead;

    await Database.Notification.update(
      { isRead: newIsReadStatus },
      { where: condition }
    );

    return sendResponse(
      res,
      200,
      null,
      `Notification marked as ${newIsReadStatus ? 'read' : 'unread'}.`
    );
  } catch (error) {
    const errorMessage = (error as Error).message;
    return sendResponse<null>(res, 500, null, errorMessage);
  }
};

const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserInterface;
    const condition =
      // eslint-disable-next-line no-constant-condition
      user.role === 'seller' ? { sellerId: user.id } : { userId: user.id };

    await Database.Notification.update({ isRead: true }, { where: condition });

    const updatedNotifications = await Database.Notification.findAll({
      where: condition,
      attributes: ['id', 'message', 'event', 'isRead', 'createdAt'],
    });
    return sendResponse(
      res,
      200,
      updatedNotifications,
      'All notifications marked as read.'
    );
  } catch (error) {
    const errorMessage = (error as Error).message;
    return sendResponse<null>(res, 500, null, errorMessage);
  }
};

export { getNotifications, readNotifications, markAllAsRead };
