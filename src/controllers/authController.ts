/* eslint-disable no-console */
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { userToken } from '../utils/tokenGenerate';
import { UserAttributes } from '../database/models/user';
import { sendResponse } from '../utils/response';

export const initiateGoogleLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate('google', { scope: ['profile', 'email'] })(
    req,
    res,
    next
  );
};

export const handleGoogleCallback = async (req: Request, res: Response) => {
  passport.authenticate(
    'google',
    async (err: unknown, user: UserAttributes | null) => {
      if (err) {
        return sendResponse(
          res,
          500,
          { error: 'Failed to authenticate with Google' },
          'Failed to authenticate with Google'
        );
      }
      if (!user) {
        return sendResponse(
          res,
          401,
          { error: 'User not found' },
          'User not found'
        );
      }

      try {
        const token = await userToken(user.id, user.email);
        sendResponse(res, 200, { token }, 'User authenticated successfully');
      } catch (error) {
        return sendResponse(
          res,
          500,
          { error: 'Failed to generate token' },
          'Failed to generate token'
        );
      }
    }
  )(req, res);
};

export { passport };
