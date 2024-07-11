import { Request, Response } from 'express';
import { sendResponse } from '../utils/response';
import Database from '../database/index';
import { verifyToken } from '../utils';

export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.params;

  try {
    const decoded = verifyToken(token);
    const user =
      decoded &&
      (await Database.User.findOne({ where: { email: decoded.email } }));

    if (!decoded || !user) {
      return sendResponse<undefined>(res, 500, undefined, 'jwt malformed');
    }

    user.verified = true;
    await user.save();
    return res.redirect(
      `${process.env.FRONTEND_DOMAIN}/verifyaccount?verified=true`
    );
  } catch (err) {
    const errors = err as Error;
    return sendResponse<null>(res, 500, null, errors.message);
  }
};
