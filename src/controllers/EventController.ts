import { EventEmitter } from 'events';
import Database from '../database';
import { Product } from '../database/models/product';
import { ProductOrder } from '../database/models/productOrder';
import { sendNotification } from '../chatSetup';

const NotificationEventEmitter = new EventEmitter();
export const EventName = {
  STOCK_LEVEL_REACH_ZERO: 'STOCK_LEVEL_REACH_ZERO',
  PRODUCT_WISHLIST_UPDATE: 'PRODUCT_WISHLIST_UPDATE',
  PAYMENT_COMPLETED: 'PAYMENT_COMPLETED',
  ORDER_STATUS: 'ORDER_STATUS',
} as const;
NotificationEventEmitter.on(
  EventName.STOCK_LEVEL_REACH_ZERO,
  async (product: Product) => {
    if (product.quantity !== 0) return;
    const notification = {
      message: `A user updated the product on wishing list(${product.name})`,
      userId: product.sellerId,
    };
    await sendNotification(product.sellerId, { ...notification, ...product });
  }
);
NotificationEventEmitter.on(
  EventName.PRODUCT_WISHLIST_UPDATE,
  async (product: Product, userId: string, message: string) => {
    const notification = {
      message,
      userId,
      isRead: false,
    };
    await Database.Notification.create(notification);
    await sendNotification(product.sellerId, { ...notification, ...product });
  }
);

/**
 * Queued due to features not implemented
 */
NotificationEventEmitter.on(
  EventName.PAYMENT_COMPLETED,
  async (userId: string, message: string) => {
    const notification = {
      message,
      userId,
      isRead: false,
    };
    await Database.Notification.create(notification);
    await sendNotification(userId, {
      ...notification,
    });
  }
);
NotificationEventEmitter.on(
  EventName.ORDER_STATUS,
  async (product: ProductOrder, userId: string, message: string) => {
    const notification = {
      message,
      userId,
      isRead: false,
    };
    await Database.Notification.create(notification);
    await sendNotification(product.userId, {
      ...notification,
      ...product,
    });
  }
);

export default NotificationEventEmitter;
