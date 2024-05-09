import randomstring from 'randomstring';
import Jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import config from '../config/config';
import { sendEmail } from '../utils/email';
import { sendResponse } from '../utils/response';
import { signToken, verifyToken } from '../utils/tokenGenerate';
import { DataInfo } from '../controllers/OTPcontroller';

export const generateOtpToken = async (id: string, email: string) => {
  const code = await randomstring.generate({
    length: 6,
    charset: 'numeric',
  });

  const body = {
    id,
    email,
    otp: code,
  };

  const { secret } = config();
  const token = await signToken(body, secret as string);

  const frontendDomain = process.env.FRONTEND_DOMAIN;
  const verifyLink = `${frontendDomain}/api/users/verify-otp/${token}`;

  const mailOptions = {
    to: email,
    subject: 'OTP Email verification',
    template: 'otp',
    context: {
      otp: `${code}`,
      verifyLink,
    },
  };
  await sendEmail(mailOptions);
  return token;
};

export const isvalid = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.params;
  const { otp } = req.body;

  if (!otp) {
    return sendResponse<null>(res, 404, null, 'Invalid OTP');
  }

  const finalresult: Jwt.VerifyCallback = async (
    err: VerifyErrors | null,
    decoded: string | JwtPayload | undefined
  ) => {
    const info = decoded as DataInfo;
    if (info?.body?.otp !== otp) {
      return sendResponse<null>(res, 401, null, 'Wrong OTP entered');
    }
    req.user = info;
    next();
  };
  verifyToken(token as string, finalresult);
};
