import { Response } from 'express';
import { UserAttributes } from '../database/models/user';
import { sendResponse, signToken } from '../utils';

export const passwordExpired = (lastUpdated: Date) => {
  const expirationPeriod = Number(process.env.PASSWORD_EXPIRATION_DAYS) || 30;
  const expirationDate = new Date(
    lastUpdated.getTime() + expirationPeriod * 24 * 60 * 60 * 1000
  );
  return expirationDate < new Date();
};

export const handlePasswordExpiration = async (
  user: UserAttributes,
  res: Response
) => {
  if (user?.role?.name !== 'admin') {
    return sendResponse(
      res,
      403,
      null,
      'Your password has expired. Please check your email to update it.'
    );
  }
  const token = signToken({ id: user.id });
  return sendResponse<string>(res, 200, token, 'Logged In Successfully');
};
