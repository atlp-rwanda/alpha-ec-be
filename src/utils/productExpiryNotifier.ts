/* eslint-disable no-console */
import { Product } from '../database/models/product';
import { User } from '../database/models/user';
import { sendEmail } from './email';

/**
 * Sends an email notification for a product that has expired.
 * @param {Product} product - The product that has expired.
 * @returns {Promise<void>} A promise that resolves when the email is sent.
 */
export async function notifyProductExpiry(product: Product) {
  try {
    const seller = await User.findOne({ where: { id: product.sellerId } });

    if (!seller) {
      console.error(`Seller not found for product ${product.name}`);
      return;
    }

    const mailOptions = {
      from: `${process.env.COMPANY_EMAIL_NAME} <${process.env.COMPANY_EMAIL}>`,
      to: seller.email,
      subject: 'Product Expiry Notification',
      template: 'expiryNotification',
      context: {
        seller: {
          name: seller.name,
          email: seller.email,
        },
        productName: product.name,
        expiryDate: product.expiryDate,
      },
    };

    await sendEmail(mailOptions);
    console.log(`Email sent to seller for product ${product.name}`);
  } catch (error) {
    // console.error(`Failed to send email for product ${product.name}:`, error);
  }
}
