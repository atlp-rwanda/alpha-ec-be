// eslint-disable-next-line import/no-extraneous-dependencies
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import hbs from 'nodemailer-express-handlebars';
import { logger } from './logger';

dotenv.config();

/**
 * Sends an email using nodemailer with handlebars template.
 * @param {Object} mailOptions - Options for sending the email.
 * @returns {Promise<void>} A promise that resolves when the email is sent.
 */
export async function sendEmail(mailOptions: nodemailer.SendMailOptions) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.COMPANY_EMAIL,
      pass: process.env.COMPANY_EMAIL_PASSWORD,
    },
  });

  const handlebarOptions: hbs.NodemailerExpressHandlebarsOptions = {
    viewEngine: {
      extname: '.handlebars',
      partialsDir: path.resolve('./src/utils/views'),
      defaultLayout: '',
    },
    viewPath: path.resolve('./src/utils/views'),
    extName: '.handlebars',
  };

  transporter.use('compile', hbs(handlebarOptions));

  const fromName = process.env.COMPANY_EMAIL_NAME;
  const fromEmail = process.env.COMPANY_EMAIL;

  const options = {
    from: `${fromName} <${fromEmail}>`,
    ...mailOptions,
  };

  const info = await transporter.sendMail(options);

  logger.info('Email sent : ', info.envelope);
}
