/* eslint-disable prettier/prettier */
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
// import { string } from 'joi';
import { User, UserAttributes } from '../database/models/user';
import Database from '../database/index';
import { sendResponse } from '../utils/response';
import { sendEmail } from '../utils/email';
import { signToken } from '../utils';

dotenv.config();
interface UserCreationAttributes extends Omit<UserAttributes, 'id'> {}

export const createUser = async (
  req: Request<object, object, UserCreationAttributes>,
  res: Response
) => {
  try {
    const { name, email, phone, address, password, verified, status } =
      req.body;

    const userExist = await Database.User.findOne({
      where: {
        email,
      },
    });

    if (userExist) {
      return sendResponse<null>(
        res,
        400,
        null,
        'A user with this email already exists.'
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = Database.User.build({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      verified,
      status,
    });

    await user.save();

    // Send verification email
    const verificationToken = signToken({ email: user.email }, '15m');

    const mailOptions = {
      to: email,
      subject: 'Your Email Verification',
      template: 'verifyAccount',
      context: {
        name,
        verificationLink: `${process.env.ROOT_URL}/api/users/verify-email/${verificationToken}`,
      },
    };
    await sendEmail(mailOptions);

    return sendResponse<null>(
      res,
      201,
      null,
      'User created successfully! Check your email for verification.'
    );
  } catch (err: unknown) {
    const errors = err as Error;
    return sendResponse<null>(res, 500, null, errors.message);
  }
};
export const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.findAll();
  res.status(200).json({ message: 'List of all users', data: users });
};
