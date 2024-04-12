import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import config from '../config/config';
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
        // Generate a new token
        const { secret } = config(); // Assuming secret is defined in .env file
        const token = jwt.sign({}, secret, { expiresIn: '2h' });

        // Return the token in the response
        return sendResponse(res, 200, { token }, 'OTP successfully verified');
      }
      return sendResponse(res, 403, null, 'Invalid OTP. Please try again');
    }
    return sendResponse(res, 403, null, 'Login required');
  } catch (err) {
    return sendResponse(res, 500, null, (err as Error).message);
  }
};

export default verifyOTP;
