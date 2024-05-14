import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { Stripe } from 'stripe';
import { logger, sendResponse } from '../utils';
import Database from '../database';
import NotificationEventEmitter, { EventName } from './EventController';

dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  logger.info('Stripe secret key is not defined');
  process.exit(1);
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-04-10',
});

interface UserInterface {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const paymentController = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserInterface;
    const userId = user.id;
    const cart = await Database.Cart.findOne({ where: { userId } });

    if (!cart) {
      return sendResponse<null>(res, 404, null, 'Cart not found');
    }

    const { totalprice } = cart;

    const paymentIntents = await stripe.paymentIntents.create({
      amount: totalprice,
      currency: 'usd',
      payment_method_types: ['card'],
    });

    const orderConfirmation = {
      orderId: cart.id,
      totalprice: cart.totalprice,
    };

    const lineItems = await Promise.all(
      cart.products.map(async product => {
        const displayProduct = await Database.Product.findOne({
          where: { id: product.productId },
          attributes: ['name', 'price'],
        });

        const productName =
          displayProduct && displayProduct.name
            ? displayProduct.name
            : 'Product Name Not Available';

        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName,
            },
            unit_amount: displayProduct ? displayProduct.price * 100 : 0,
          },
          quantity: product.quantity,
        };
      })
    );

    const customer = await stripe.customers.create({
      metadata: {
        buyerId: userId,
        products: JSON.stringify(cart.products),
      },
    });

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      success_url: `${process.env.ROOT_URL}/api/successfull-pay?paymentId={CHECKOUT_SESSION_ID}&user=${userId}`,
      cancel_url: `${process.env.ROOT_URL}/api/cancelled-pay?paymentIntentId=${paymentIntents.id}`,
      line_items: lineItems,
      mode: 'payment',
      customer: customer.id,
    });

    return res.status(200).json({
      message:
        'Checkout done!, Continue with the url to create Order and complete Payment',
      orderConfirmation,
      Success_url: checkoutSession.url,
      Cancel_url: checkoutSession.cancel_url,
    });
  } catch (err) {
    const errors = err as Error;
    return sendResponse<null>(res, 500, null, errors.message);
  }
};

export const webhookProcess = async (req: Request, res: Response) => {
  const { paymentId } = req.query;

  const userId2 = req.query.user as string;
  const cart = await Database.Cart.findOne({ where: { userId: userId2 } });

  if (!cart) {
    return sendResponse<null>(res, 404, null, 'Cart not found');
  }

  const session = await stripe.checkout.sessions.retrieve(paymentId as string);
  if (session.payment_status === 'paid') {
    const order = Database.Order.build({
      userId: userId2,
      status: 'pending',
    });
    await order.save();

    await Promise.all(
      cart.products.map(async item => {
        const product = await Database.Product.findOne({
          where: { id: item.productId },
          attributes: ['id', 'sellerId'],
        });

        if (!product) {
          return sendResponse<null>(res, 404, null, 'Product not found');
        }

        const productOrder = {
          orderId: order.id,
          userId: userId2,
          sellerId: product.sellerId,
          productId: item.productId,
          quantity: item.quantity,
          status: 'pending',
        };
        await Database.ProductOrder.create(productOrder);

        // STOCK UPDATES
        const prodInStock = await Database.Product.findByPk(
          productOrder.productId
        );
        if (!prodInStock) {
          return sendResponse<null>(
            res,
            404,
            null,
            'Product in stock not found'
          );
        }
        prodInStock.quantity -= productOrder.quantity;
        await prodInStock.save();
      })
    );

    // cart delete
    await Database.Cart.destroy({ where: { userId: userId2 } });
  }

  NotificationEventEmitter.emit(
    EventName.PAYMENT_COMPLETED,
    userId2,
    `Payment Completed Successfully!!`
  );
  return sendResponse(res, 200, null, 'Payment Completed Successfully!!');
};

export const getorder = async (req: Request, res: Response) => {
  const { id } = req.user as UserInterface;
  try {
    const orderFound = await Database.Order.findOne({
      where: { userId: id },
      include: [
        {
          model: Database.User,
          as: 'buyer',
          attributes: ['name', 'photoUrl'],
        },
      ],
    });
    if (!orderFound) {
      return sendResponse<null>(res, 404, null, 'Order not found');
    }
    const productsOrders = await Database.ProductOrder.findAll({
      where: { orderId: orderFound.id },
      include: [
        {
          model: Database.User,
          as: 'prodOrderSeller',
          attributes: ['name', 'photoUrl'],
        },
        {
          model: Database.Product,
          as: 'orderedProduct',
          attributes: ['name', 'price', 'images'],
        },
      ],
    });
    const result = { orderFound, productsOrders };
    return sendResponse(res, 200, result, 'Order retrieved');
  } catch (err: unknown) {
    const errors = err as Error;
    return sendResponse<null>(res, 500, null, errors.message);
  }
};

export const webhookCancelProcess = async (req: Request, res: Response) => {
  const { paymentIntentId } = req.query;
  try {
    await stripe.paymentIntents.cancel(paymentIntentId as string);

    return sendResponse(res, 200, null, 'Payment process Cancelled!!');
  } catch (err) {
    const errors = err as Error;
    return sendResponse<null>(res, 500, null, errors.message);
  }
};
