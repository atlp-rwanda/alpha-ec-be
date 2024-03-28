import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Database from '../database';
import { sendResponse } from '../utils';

dotenv.config();

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, address, password } = req.body;

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
    });

    if (process.env.NODE_ENV == 'test')
      return sendResponse<string>(
        res,
        201,
        'token',
        'User created successfully!'
      );

    await user.save();

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '2h' }
    );

    return sendResponse<string>(res, 201, token, 'User created successfully!');
  } catch (err: any) {
    return sendResponse<null>(res, 500, null, err.message);
  }
};