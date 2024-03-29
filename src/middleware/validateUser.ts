import { NextFunction, Request, Response } from 'express';
import { expectedNewUser, testPassword } from '../utils/validations';
import sendResponse from '../utils/response';

export const isNewUserValid = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = expectedNewUser.validate(req.body);
  if (error) {
    return sendResponse<null>(res, 400, null, error.message);
  }

  const passwordError = testPassword(req.body.password);
  if (passwordError) {
    return sendResponse<null>(res, 400, null, passwordError);
  }

  next();
};
