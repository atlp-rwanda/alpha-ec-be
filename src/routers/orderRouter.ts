import express from 'express';
import { isAuthenticated, isBuyer, isSeller } from '../middleware';
import {
  paymentController,
  webhookCancelProcess,
  webhookProcess,
} from '../controllers/paymentController';
import { getorder, getproductorder, updateproductorder } from '../controllers';

const orderRouter = express.Router();

orderRouter.post('/payment', isAuthenticated, isBuyer, paymentController);
orderRouter.get('/successfull-pay', webhookProcess);
orderRouter.get('/cancelled-pay', webhookCancelProcess);
orderRouter.get('/product-orders', isAuthenticated, getproductorder);
orderRouter.put(
  '/product-orders/:orderId/status',
  isAuthenticated,
  isSeller,
  updateproductorder
);
orderRouter.get('/orders', isAuthenticated, getorder);

export default orderRouter;
