import { Request, Response } from 'express';

import Database from '../database';
import { sendResponse } from '../utils';
import { UserInterface } from './productController';

const getNotifications = async (req: Request, res: Response) => {
  const notifications = await Database.Notification.findAll({
    where: {
      userId: (req.user as UserInterface).id,
    },
  });
  return sendResponse(res, 200, notifications, 'all notifications');
};

const readNotifications = async (req: Request, res: Response) => {
  const nots = await Database.Notification.update(
    {
      isRead: true,
    },
    {
      where: {
        userId: (req.user as UserInterface).id,
      },
    }
  );
  return sendResponse(res, 200, nots, 'notifications marked as read');
};
export { getNotifications, readNotifications };
