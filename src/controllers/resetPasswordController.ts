import { Request, Response } from 'express';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Database from '../database/index';
import { sendResponse } from '../utils/response';
import { sendEmail } from '../utils/email';
import { signToken } from '../utils';
import getDatabaseConfig from '../config/config';

dotenv.config();

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await Database.User.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      return sendResponse<null>(
        res,
        404,
        null,
        'A user with this email does not exist.'
      );
    }
    const resetToken = await signToken({ id: user.id }, '15m');

    const link = `${process.env.ROOT_URL}/api/users/reset-password/${resetToken}`;
    const mailOptions = {
      to: email,
      subject: 'Reset Password',
      template: 'resetEmail',
      context: {
        link,
      },
    };
    await sendEmail(mailOptions);
    return sendResponse<string>(
      res,
      200,
      resetToken,
      'Password reset link sent successfully!'
    );
  } catch (err: unknown) {
    const errors = err as Error;
    return sendResponse<null>(res, 500, null, errors.message);
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const { secret } = getDatabaseConfig();
    const decoded = jwt.verify(token, secret) as {
      id: string;
      exp: number;
    };
    const userId = decoded.id;
    // Retrieve user from the database
    const user = await Database.User.findOne({ where: { id: userId } });

    if (!user) {
      return sendResponse<null>(
        res,
        400,
        null,
        'Password reset token is invalid.'
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await user.update({
      password: hashedPassword,
      lastTimePasswordUpdated: new Date(),
    });
    const data = signToken({ id: user.id }, '2h');
    res.cookie('token', data);
    res.header('Authorization', `Bearer ${data}`);
    return sendResponse<null>(
      res,
      200,
      null,
      'Password reset and Logged in successfully!'
    );
  } catch (err: unknown) {
    if (err instanceof TokenExpiredError) {
      return sendResponse<null>(
        res,
        400,
        null,
        'Password reset token has expired.'
      );
    }
    if (err instanceof JsonWebTokenError) {
      return sendResponse<null>(
        res,
        400,
        null,
        'Invalid password reset token.'
      );
    }
    return sendResponse<null>(res, 500, null, 'An unexpected error occurred.');
  }
};
