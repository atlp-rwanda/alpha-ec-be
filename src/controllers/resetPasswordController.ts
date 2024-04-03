import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import sendResetPasswordEmail from '../utils/sendEmails';
import Database from '../database/index';
import { sendResponse } from '../utils/response';

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
        400,
        null,
        'A user with this email does not exist.'
      );
    }
    const resetToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'SECRET',
      {
        expiresIn: '1h',
      }
    );
    try {
      await sendResetPasswordEmail(email, resetToken);
      return sendResponse<string>(
        res,
        200,
        resetToken,
        'Password reset link sent successfully!'
      );
    } catch (err) {
      return sendResponse<null>(
        res,
        500,
        null,
        'Something went wrong, please try again later.'
      );
    }
  } catch (err: unknown) {
    const errors = err as Error;
    return sendResponse<null>(res, 500, null, errors.message);
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;
  const { confirmPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
      id: string;
      exp: number;
    };
    const userId = decoded.id;
    const tokenExpiration = new Date(decoded.exp * 1000);

    // Check if the token has expired
    if (tokenExpiration <= new Date()) {
      return sendResponse<null>(
        res,
        400,
        null,
        'Password reset token has expired.'
      );
    }

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
    if (password !== confirmPassword) {
      return sendResponse<null>(res, 400, null, 'Passwords do not match.');
    }
    await user.update({
      password: hashedPassword,
    });

    const data = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'SECRET', {
      expiresIn: '2h',
    });
    res.cookie('token', data);
    res.header('Authorization', `Bearer ${data}`);
    return sendResponse<string>(
      res,
      200,
      data,
      'Password reset and Logged in successfully!'
    );
  } catch (err: unknown) {
    const errors = err as Error;
    return sendResponse<null>(res, 500, null, errors.message);
  }
};
