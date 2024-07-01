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
  async (product: Product, userId: string) => {
    if (product.quantity !== 0) return;

    const user = await Database.User.findOne({
      where: { id: userId },
      attributes: ['name'],
    });

    if (!user) {
      return;
    }
    const notificationMessage = `Dear ${user.name}, the stock for ${product.name} has reached zero.`;

    const notification = {
      message: notificationMessage,
      userId,
      sellerId: product.sellerId,
      isRead: false,
      event: EventName.STOCK_LEVEL_REACH_ZERO,
    };
    await Database.Notification.create(notification);
    await sendNotification(userId, {
      message: notification.message,
      event: notification.event,
      createdAt: new Date(),
    });
  }
);

NotificationEventEmitter.on(
  EventName.PRODUCT_WISHLIST_UPDATE,
  async (
    product: Product,
    userId: string,
    message: string,
    sellerId: string
  ) => {
    const notification = {
      message,
      userId,
      sellerId,
      isRead: false,
      event: EventName.PRODUCT_WISHLIST_UPDATE,
    };
    await Database.Notification.create(notification);
    await sendNotification(product.sellerId, {
      ...notification,
      event: notification.event,
      createdAt: new Date(),
    });
  }
);
NotificationEventEmitter.on(
  EventName.PAYMENT_COMPLETED,
  async (userId: string, message: string, sellerId: string) => {
    const notification = {
      message,
      userId,
      sellerId,
      isRead: false,
      event: EventName.PAYMENT_COMPLETED,
    };
    await Database.Notification.create(notification);
    await sendNotification(userId, {
      ...notification,
      event: notification.event,
      createdAt: new Date(),
    });
  }
);

NotificationEventEmitter.on(
  EventName.ORDER_STATUS,
  async (
    product: ProductOrder,
    userId: string,
    message: string,
    sellerId: string
  ) => {
    const notification = {
      message,
      userId,
      sellerId,
      isRead: false,
      event: EventName.ORDER_STATUS,
    };
    await Database.Notification.create(notification);
    await sendNotification(product.userId, {
      ...notification,
      event: notification.event,
      createdAt: new Date(),
    });
  }
);

export default NotificationEventEmitter;
