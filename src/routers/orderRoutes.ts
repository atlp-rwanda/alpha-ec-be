import express from 'express';
import {
  addproductorder,
  getproductorder,
  updateproductorder,
} from '../controllers/product-orderController';
import { isAuthenticated, isBuyer } from '../middleware';

const routerOrders = express.Router();

routerOrders.post('/orders', isAuthenticated, isBuyer, addproductorder);
routerOrders.get('/orders', isAuthenticated, isBuyer, getproductorder);
routerOrders.put(
  '/orders/:orderId/status',
  isAuthenticated,
  isBuyer,
  updateproductorder
);

export default routerOrders;
