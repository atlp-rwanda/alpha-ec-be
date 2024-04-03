import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserAttributes } from '../database/models/user';
import Database from '../database/index';
import { sendResponse } from '../utils/response';
// eslint-disable-next-line import/extensions
import getDatabaseConfig from '../config/config.js';

dotenv.config();

interface UserCreationAttributes extends Omit<UserAttributes, 'id'> {}

export const createUser = async (
  // eslint-disable-next-line @typescript-eslint/ban-types
  req: Request<{}, {}, UserCreationAttributes>,
  res: Response
) => {
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

    await user.save();

    const { secret } = getDatabaseConfig();

    const token = jwt.sign({ id: user.id }, secret, { expiresIn: '2h' });

    return sendResponse<string>(res, 201, token, 'User created successfully!');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return sendResponse<null>(res, 500, null, err.message);
  }
};
