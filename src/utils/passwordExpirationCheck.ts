import { sendEmail } from './email';
import { logger } from './logger';

export const passwordExpirationNotification = async (
  lastTimePasswordUpdated: Date,
  email: string
) => {
  const ExpiredInDays = parseInt(process.env.PASSWORD_EXPIRATION_DAYS!, 10);

  const notificationTime = parseInt(process.env.NOTIFICATION_TIME!, 10);

  const expiratedTime = new Date(lastTimePasswordUpdated);
  expiratedTime.setDate(expiratedTime.getDate() + ExpiredInDays);
  expiratedTime.setHours(23, 4, 0, 0);
  const notificationDays = new Date(expiratedTime);
  notificationDays.setDate(notificationDays.getDate() - notificationTime);

  const currentTime = new Date();
  if (currentTime >= notificationDays && currentTime <= expiratedTime) {
    const mailOptions = {
      to: email,
      subject: 'Urgently! Updating password',
      template: 'updatePassword',
    };
    sendEmail(mailOptions);
    logger.info(`Password update email sent successfully to ${email}`);
  }
};
