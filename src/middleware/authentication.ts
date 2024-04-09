import { NextFunction, Response, Request } from 'express';
import passport from '../config/passportConfig';
import { UserAttributes } from '../database/models/user';
import { sendResponse } from '../utils';

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    'jwt',
    { session: false },
    (err: Error, user: UserAttributes) => {
      if (!user) {
        return sendResponse(res, 403, null, 'Please login...');
      }

      const currUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: 'seller',
      };

      req.user = currUser;

      next();
    }
  )(req, res, next);
};

export const isSeller = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !('role' in req.user) || req.user.role !== 'seller') {
    return sendResponse(res, 401, null, 'Not authorized...');
  }
  next();
};
