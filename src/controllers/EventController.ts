import { EventEmitter } from 'events';
import Database from '../database';
import { Product } from '../database/models/product';
import { sendNotification } from '../utils/notification';

const NotificationEventEmitter = new EventEmitter();
export const EventName = {
  STOCK_LEVEL_REACH_ZERO: 'STOCK_LEVEL_REACH_ZERO',
  PRODUCT_WISHLIST_UPDATE: 'PRODUCT_WISHLIST_UPDATE',
  ORDER_CREATED: 'ORDER_CREATED',
  ORDER_REJECTED: 'ORDER_REJECTED',
  PAYMENT_COMPLETED: 'PAYMENT_COMPLETED',
  ORDER_ACCEPTED: 'ORDER_ACCEPTED',
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

// TODO
/**
 * Queued due to features not implemented
 */
NotificationEventEmitter.on(EventName.ORDER_CREATED, () => {});
NotificationEventEmitter.on(EventName.ORDER_REJECTED, () => {});
NotificationEventEmitter.on(EventName.PAYMENT_COMPLETED, () => {});
NotificationEventEmitter.on(EventName.ORDER_ACCEPTED, () => {});

export default NotificationEventEmitter;
