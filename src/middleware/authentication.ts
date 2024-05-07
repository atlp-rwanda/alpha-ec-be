import { NextFunction, Response, Request } from 'express';
import passport from '../config/passportConfig';
import { UserAttributes } from '../database/models/user';
import { sendResponse } from '../utils';
import Database from '../database';
import {
  handlePasswordExpiration,
  passwordExpired,
} from './passwordExpiration';

const checkLogout = async (req: Request): Promise<boolean> => {
  const authorization = req.header('Authorization')?.split(' ')[1];
  const logout = await Database.Logout.findOne({
    where: { token: authorization },
  });
  if (logout) {
    return true;
  }
  return false;
};

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    'jwt',
    { session: false },
    async (err: Error, user: UserAttributes) => {
      if (!user) {
        return sendResponse(res, 401, null, 'You are not authorized');
      }
      const isLogout = await checkLogout(req);
      if (isLogout) {
        return sendResponse(res, 401, null, 'You are not authorized');
      }
      if (passwordExpired(user.lastTimePasswordUpdated)) {
        return handlePasswordExpiration(user, res);
      }

      const currUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user?.role?.name,
      };
      req.user = currUser;

      next();
    }
  )(req, res, next);
};

export const isSeller = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !('role' in req.user) || req.user.role !== 'seller') {
    return sendResponse(res, 403, null, 'Not authorized!');
  }
  next();
};
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !('role' in req.user) || req.user.role !== 'admin') {
    return sendResponse(res, 403, null, 'Not authorized!');
  }
  next();
};

export const isBuyer = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !('role' in req.user) || req.user.role !== 'buyer') {
    return sendResponse(res, 403, null, 'Not authorized!');
  }
  next();
};
