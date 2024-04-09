import { Request, Response } from 'express';
import Database from '../database/index';
import { sendResponse } from '../utils/response';

interface UserInterface {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const updateUser = async (req: Request, res: Response) => {
  try {
    const users = req.user as UserInterface;
    const { id } = users;
    const fieldsToUpdate = req.body;
    if (Object.keys(fieldsToUpdate).length === 0) {
      return sendResponse<null>(
        res,
        400,
        null,
        'No fields provided to update!'
      );
    }

    const result = await Database.User.update(fieldsToUpdate, {
      where: { id },
    });
    if (result[0] > 0) {
      const updateduser = await Database.User.findOne({
        where: { id },
      });
      return sendResponse(
        res,
        200,
        updateduser,
        'profile updated successfully!'
      );
    }
  } catch (err: unknown) {
    const errors = err as Error;
    return sendResponse<null>(res, 500, null, errors.message);
  }
};
export const getUser = async (req: Request, res: Response) => {
  try {
    const users = req.user as UserInterface;
    const { id } = users;

    const myprofile = await Database.User.findOne({
      where: { id },
    });
    sendResponse(res, 200, myprofile, 'User retrieved successfully');
  } catch (err: unknown) {
    const errors = err as Error;
    sendResponse<null>(res, 401, null, errors.message);
  }
};
