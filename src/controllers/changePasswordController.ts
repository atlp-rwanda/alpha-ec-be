/* eslint-disable array-callback-return */
/* eslint-disable radix */
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import Database from '../database';
import { sendResponse } from '../utils';
// /// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface User {
  id: string;
  email: string;
  password: string;
}
// /// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const updatePasswordController = async (req: Request, res: Response) => {
  const user = req.user as User;
  try {
    const { oldPassword, newPassword } = req.body;

    // find user by id
    const userData = await Database.User.findByPk(user.id);
    // accessing password
    const userPassword = userData?.password as string;

    // comparing password
    const isOldPasswordValid = bcrypt.compareSync(oldPassword, userPassword);

    // if passwords are the same

    if (isOldPasswordValid) {
      const saltRound = 10;
      const hashNewPass = await bcrypt.hash(newPassword, saltRound);
      // Store the new password to the database
      await Database.User.update(
        { password: hashNewPass, lastTimePasswordUpdated: new Date() },
        { where: { email: user.email } }
      );
      return sendResponse<string>(
        res,
        200,
        user.email,
        'Password changed successfully'
      );
    }
    return sendResponse<null>(res, 400, null, 'Invalid credentials');
  } catch (err: unknown) {
    const errors = err as Error;
    return sendResponse<null>(res, 500, null, errors.message);
  }
};

export default updatePasswordController;
