import { Request, Response } from 'express';
import { config } from 'dotenv';
import { generateOtpToken } from '../middleware/otpauthMiddleware';
import { User } from '../database/models/user';
import { sendResponse } from '../utils/response';
import { signToken, verifyToken } from '../utils';

config();

export interface DataInfo {
  body: {
    id: string;
    email: string;
    otp: string;
  };
}

export interface UserData {
  dataValues: {
    roleId: string;
    firstName: string;
    lastName: string;
    email: string;
    id: string;
  };
}

const sendOtp = async (req: Request, res: Response, isEmail: string) => {
  const user = (await User.findOne({
    where: {
      email: isEmail,
    },
  })) as unknown as UserData;

  const { id, email } = user.dataValues;

  const token = await generateOtpToken(id, email);

  return sendResponse<string>(
    res,
    201,
    token,
    'Verify OTP sent to your email to continue'
  );
};

const sellerOtp = async (req: Request, res: Response) => {
  const info = req.user as DataInfo;

  const tokenSeller = signToken({
    id: info.body.id,
    email: info.body.email,
    role: 'seller',
  });

  console.log('token', tokenSeller);

  return sendResponse<string>(res, 200, tokenSeller, 'Seller login successful');
};

const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.params;
  try {
    const decoded = verifyToken(token as string);
    if (decoded) {
      sendResponse(res, 200, '', 'OTP successfully verified.');
    } else {
      sendResponse(res, 404, null, 'Invalid or expired OTP.');
    }
  } catch (error) {
    sendResponse(res, 500, null, 'An error occurred during verification.');
  }
};

export { sendOtp, sellerOtp, verifyOtp };
