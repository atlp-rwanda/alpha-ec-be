import express from 'express';
import {
  getNotifications,
  markAllAsRead,
  readNotifications,
} from '../controllers/notificationsController';
import { isAuthenticated } from '../middleware';

const routerNotification = express.Router();
routerNotification.get('/notifications', isAuthenticated, getNotifications);
routerNotification.patch(
  '/notifications/markall',
  isAuthenticated,
  markAllAsRead
);
routerNotification.patch(
  '/notifications/:id',
  isAuthenticated,
  readNotifications
);

export default routerNotification;
