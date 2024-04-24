/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
import cron from 'node-cron';
import { Op } from 'sequelize';
import dotenv from 'dotenv';
import { Product } from './database/models/product';
import { User } from './database/models/user';
import { notifyProductExpiry } from './utils/productExpiryNotifier';

dotenv.config();

export const scheduleProductExpiryCron = (): void => {
  const cronTime = process.env.CRONTIME || '';

  cron.schedule(cronTime, async () => {
    console.log(`Running a cron job at ${cronTime}`);

    const currentDate = new Date();
    const products = await Product.findAll({
      where: {
        expiryDate: {
          [Op.lt]: currentDate,
        },
      },
      include: [
        {
          model: User,
          as: 'seller',
        },
      ],
    });

    for (const product of products) {
      if (product.expired) {
        await product.update({ status: false });
      }
      await product.update({ expired: true });
      await notifyProductExpiry(product);
    }
  });
};
