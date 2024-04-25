import { Request, Response } from 'express';
import { sendResponse } from '../utils';
import Database from '../database';

const logoutUser = async (req: Request, res: Response) => {
  try {
    const authorization = req.header('Authorization')?.split(' ')[1];

    const logout = Database.Logout.build({
      token: authorization as string,
    });
    await logout.save();

    return sendResponse(res, 200, null, 'Logged Out Succesfully');
  } catch (error) {
    return sendResponse(res, 500, null, 'Internal Server Error');
  }
};

export default logoutUser;
