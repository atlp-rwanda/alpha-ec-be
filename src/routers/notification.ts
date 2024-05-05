import express from 'express';
import {
  getNotifications,
  deleteNotification,
  deleteNotifications,
  readNotifications,
} from '../controllers/notificationsController';
import { isAuthenticated } from '../middleware';

const routerNotification = express.Router();

routerNotification.get('/notifications', isAuthenticated, getNotifications);
routerNotification.delete(
  '/notifications/:notificationId',
  isAuthenticated,
  deleteNotification
);
routerNotification.delete(
  '/notifications',
  isAuthenticated,
  deleteNotifications
);
routerNotification.put('/notifications', isAuthenticated, readNotifications);

export default routerNotification;
