import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { logger } from './logger';

dotenv.config();

const sendEmail = async (reciever: {
  email: string;
  subject: string;
  text: string;
  html: string;
}) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const options = {
    from: process.env.EMAIL_USER,
    to: reciever.email,
    subject: reciever.subject,
    text: reciever.text,
    html: reciever.html,
    secure: true,
  };

  transporter.sendMail(options, (error, info) => {
    if (error) {
      logger.error(error);
    } else {
      logger.info(`Email sent: ${info.response}`);
    }
  });
};
export default sendEmail;
