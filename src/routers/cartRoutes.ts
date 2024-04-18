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
import { isAuthenticated, validationMiddleware } from '../middleware';

const routercart = express.Router();

routercart.post(
  '/carts',
  isAuthenticated,
  validationMiddleware(quantitySchema),
  addItemToCart
);
routercart.get('/carts', isAuthenticated, getCart);
routercart.patch('/carts/:cartId', isAuthenticated, updateCart);
routercart.delete(
  '/carts/products/:id',
  isAuthenticated,
  deleteProductFromCart
);
routercart.delete('/carts/:cartId', isAuthenticated, deleteCart);
routercart.put('/carts/:cartId', isAuthenticated, emptyCart);

export default routercart;
