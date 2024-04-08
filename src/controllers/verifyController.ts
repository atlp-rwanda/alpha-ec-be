import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
// import jwt, { SignOptions } from 'jsonwebtoken';
import Database from '../database';
import { getCookieInfo } from '../utils/handleCookie';
import { sendResponse } from '../utils';

dotenv.config();

const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { verificationCode } = req.body;

    if (req.headers.cookie) {
      const Cookiearray = req.headers.cookie.trim().split(';');
      const cookies = await getCookieInfo(Cookiearray);
      const hashedToken = cookies.onloginToken || '';

      // compare incoming token with stored hashed token
      const decodedToken = Buffer.from(hashedToken, 'base64').toString('utf-8');
      const incomingToken = verificationCode.trim();
      const isMatch = await bcrypt.compare(incomingToken, decodedToken);

      if (isMatch) {
        const user = await Database.User.findOne({
          where: { id: cookies.onloggingUserid },
        });

        if (!user) {
          return sendResponse<null>(res, 404, null, 'User not found');
        }
        return sendResponse<null>(res, 200, null, 'OTP successfully verified');
      }
      return sendResponse(res, 403, null, 'OTP not validated');
    }
    return sendResponse(res, 403, null, 'Login required');
  } catch (err) {
    return sendResponse(res, 500, null, (err as Error).message);
  }
};

export default verifyOTP;
