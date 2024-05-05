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
const deleteNotification = async (req: Request, res: Response) => {
  const nots = await Database.Notification.destroy({
    where: {
      id: req.params.notificationId,
      userId: (req.user as UserInterface).id,
    },
  });
  return sendResponse(res, 200, nots, 'notification deleted');
};
const deleteNotifications = async (req: Request, res: Response) => {
  const nots = await Database.Notification.destroy({
    where: {
      userId: (req.user as UserInterface).id,
    },
  });
  return sendResponse(res, 200, nots, 'notifications deleted');
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
export {
  getNotifications,
  deleteNotification,
  deleteNotifications,
  readNotifications,
};
