import { Request, Response } from 'express';
import Database from '../database/index';
import { sendResponse } from '../utils';
import { cartProductInterface } from '../database/models/cart';
import { calculateTotal, formatCartItems } from '../utils/cartsCalculations';
import NotificationEventEmitter, { EventName } from './EventController';

interface UserInterface {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const addItemToCart = async (req: Request, res: Response) => {
  const { id } = req.user as UserInterface;

  try {
    const product = req.body as cartProductInterface;
    const validProduct = await Database.Product.findOne({
      where: { id: product.productId },
    });

    if (!validProduct) {
      return sendResponse<null>(res, 404, null, 'Product not found');
    }
    if (validProduct.quantity < product.quantity) {
      NotificationEventEmitter.emit(
        EventName.STOCK_LEVEL_REACH_ZERO,
        validProduct,
        id
      );
      return sendResponse<null>(
        res,
        406,
        null,
        'Quantity exceeds available stock'
      );
    }
    const cartExist = await Database.Cart.findOne({
      where: { userId: id },
    });
    if (!cartExist) {
      const unitPrice =
        validProduct.bonus === null
          ? validProduct.price
          : validProduct.price -
            (validProduct.price * Number(validProduct.bonus)) / 100;
      const cart = Database.Cart.build({
        userId: id,
        products: [product],
        totalprice: unitPrice * product.quantity,
      });
      await cart.save();
      const returnCart = {
        id: cart.id,
        products: await formatCartItems([product]),
        totalprice: cart.totalprice,
      };
      return sendResponse(res, 201, returnCart, 'Product added to cart');
    }
    const findProduct = cartExist.products.find(
      p => p.productId === product.productId
    );
    if (findProduct) {
      return sendResponse<null>(
        res,
        409,
        null,
        'Product already in cart, Please update!'
      );
    }

    const updatedProducts = [...cartExist.products, product];
    const updatedTotalPrice = await calculateTotal(updatedProducts);
    await Database.Cart.update(
      { products: updatedProducts, totalprice: updatedTotalPrice },
      { where: { id: cartExist.id }, returning: true }
    );

    const returnCart2 = {
      id: cartExist.id,
      products: await formatCartItems(updatedProducts),
      totalprice: updatedTotalPrice,
    };
    return sendResponse(res, 201, returnCart2, 'Product is added to cart ');
  } catch (err: unknown) {
    const errors = err as Error;
    return sendResponse<null>(res, 500, null, errors.message);
  }
};

//= ==========================================================================================================================
export const getCart = async (req: Request, res: Response) => {
  const { id } = req.user as UserInterface;
  try {
    const cartFound = await Database.Cart.findOne({
      where: { userId: id },
    });
    if (!cartFound) {
      return sendResponse<null>(res, 404, null, 'Cart not found');
    }
    const cart = {
      id: cartFound.id,
      products: await formatCartItems(cartFound.products),
      totalprice: cartFound.totalprice,
    };
    return sendResponse(res, 200, cart, 'Cart retrieved ');
  } catch (err: unknown) {
    const errors = err as Error;
    return sendResponse<null>(res, 500, null, errors.message);
  }
};
//= ========================================================================================================================
// update cart where cartid will be in params and the quantity will change only

export const updateCart = async (req: Request, res: Response) => {
  const { cartId } = req.params;
  const { productId, quantity } = req.body;
  try {
    const product = req.body as cartProductInterface;
    const validProduct = await Database.Product.findOne({
      where: { id: product.productId },
    });
    if (!validProduct) {
      return sendResponse<null>(res, 404, null, 'Product not found');
    }
    if (validProduct.quantity < product.quantity) {
      return sendResponse<null>(res, 406, null, 'Quantity Exceeds Stock');
    }
    const cartFound = await Database.Cart.findOne({
      where: { id: cartId },
    });
    if (!cartFound) {
      return sendResponse<null>(res, 404, null, 'Cart not found');
    }
    const updatedProducts = cartFound.products.map(p => {
      if (p.productId === productId) {
        return { ...p, quantity };
      }
      return p;
    });
    const updatedTotalPrice = await calculateTotal(updatedProducts);
    await Database.Cart.update(
      { products: updatedProducts, totalprice: updatedTotalPrice },
      { where: { id: cartFound.id }, returning: true }
    );
    const returnCart2 = {
      id: cartFound.id,
      products: await formatCartItems(updatedProducts),
      totalprice: updatedTotalPrice,
    };
    return sendResponse(res, 201, returnCart2, 'Cart updated');
  } catch (err: unknown) {
    const errors = err as Error;
    return sendResponse<null>(res, 500, null, errors.message);
  }
};

//= =============================================================================================================================
// delete entire cart with cartid

export const deleteCart = async (req: Request, res: Response) => {
  const { id } = req.user as UserInterface;
  const { cartId } = req.params;
  try {
    const cartFound = await Database.Cart.findOne({
      where: { userId: id },
    });
    if (!cartFound) {
      return sendResponse<null>(res, 404, null, 'Cart not found');
    }
    await Database.Cart.destroy({ where: { id: cartId } });
    return sendResponse(res, 200, null, 'Cart deleted');
  } catch (err: unknown) {
    const errors = err as Error;
    return sendResponse<null>(res, 500, null, errors.message);
  }
};
//= ====================================================================================================================
// will delete a product from the cart
export const deleteProductFromCart = async (req: Request, res: Response) => {
  const { id } = req.user as UserInterface;
  const productId = req.params.id;
  try {
    const cartFound = await Database.Cart.findOne({
      where: { userId: id },
    });
    if (!cartFound) {
      return sendResponse<null>(res, 404, null, 'Cart not found');
    }

    const updatedProducts = cartFound.products.filter(
      p => p.productId !== productId
    );
    const updatedTotalPrice = await calculateTotal(updatedProducts);
    await Database.Cart.update(
      { products: updatedProducts, totalprice: updatedTotalPrice },
      { where: { id: cartFound.id }, returning: true }
    );
    const returnCart2 = {
      id: cartFound.id,
      products: await formatCartItems(updatedProducts),
      totalprice: updatedTotalPrice,
    };

    return sendResponse(res, 200, returnCart2, 'Product deleted');
  } catch (err: unknown) {
    const errors = err as Error;
    return sendResponse<null>(res, 500, null, errors.message);
  }
};
//= ===========================================================================================================================
// empty the cart

export const emptyCart = async (req: Request, res: Response) => {
  const { id } = req.user as UserInterface;
  try {
    const cartFound = await Database.Cart.findOne({
      where: { userId: id },
    });
    if (!cartFound) {
      return sendResponse<null>(res, 404, null, 'Cart not found');
    }
    await Database.Cart.update(
      { products: [], totalprice: 0 },
      { where: { id: cartFound.id }, returning: true }
    );
    return sendResponse(res, 200, null, '  you have erased the cart');
  } catch (err: unknown) {
    const errors = err as Error;
    return sendResponse<null>(res, 500, null, errors.message);
  }
};
