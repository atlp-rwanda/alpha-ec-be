import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Sends a reset password email.
 * @param {string} email - The email address of the recipient.
 * @param {string} resetToken - The token used to reset the password.
 * @returns {Promise<void>} A promise that resolves when the email is sent.
 */
async function sendResetPasswordEmail(email: string, resetToken: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const link = `${process.env.SERVER_URL}/api/users/reset-password/${resetToken}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Resetting password',
    html: `<p>Click on the link to reset your password: <a href="${link}">Reset Password</a></p>`,
  };

  await transporter.sendMail(mailOptions);
}
export default sendResetPasswordEmail;
