import express from 'express';
import {
  getNotifications,
  readNotifications,
} from '../controllers/notificationsController';
import { isAuthenticated } from '../middleware';

const routerNotification = express.Router();

routerNotification.get('/notifications', isAuthenticated, getNotifications);
routerNotification.put('/notifications', isAuthenticated, readNotifications);

export default routerNotification;
