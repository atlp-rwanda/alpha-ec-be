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

    const user = await Database.User.findOne({ where: { id } });
    if (!user) {
      return sendResponse<null>(res, 404, null, 'User not found');
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
    return sendResponse(res, 404, req.body, 'Fail to update');
  } catch (err: unknown) {
    const errors = err as Error;
    return sendResponse<null>(res, 500, null, errors.message);
  }
};
