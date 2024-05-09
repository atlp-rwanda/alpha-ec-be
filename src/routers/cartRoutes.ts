import express from 'express';
import {
  addItemToCart,
  getCart,
  updateCart,
  deleteProductFromCart,
  deleteCart,
  emptyCart,
} from '../controllers/cartsController';
import { quantitySchema } from '../validations/cartvalidation';
import { isAuthenticated, isBuyer, validationMiddleware } from '../middleware';

const routercart = express.Router();

routercart.post(
  '/carts',
  isAuthenticated,
  isBuyer,
  validationMiddleware(quantitySchema),
  addItemToCart
);
routercart.get('/carts', isAuthenticated, getCart);
routercart.patch(
  '/carts/:cartId',
  isAuthenticated,
  isBuyer,
  validationMiddleware(quantitySchema),
  updateCart
);
routercart.delete(
  '/carts/products/:id',
  isAuthenticated,
  isBuyer,
  deleteProductFromCart
);
routercart.delete('/carts/:cartId', isAuthenticated, isBuyer, deleteCart);
routercart.put('/carts/:cartId', isAuthenticated, isBuyer, emptyCart);

export default routercart;
