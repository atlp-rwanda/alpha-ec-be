/* eslint-disable no-console */
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { UserAttributes } from '../database/models/user';
import { sendResponse, signToken } from '../utils';

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
        const token = signToken({ id: user.id });
        const frontendurl = `${process.env.FRONTEND_DOMAIN}`;
        res.redirect(`${frontendurl}?token=${token}`);
      } catch (err: unknown) {
        const errors = err as Error;
        return sendResponse<null>(res, 500, null, errors.message);
      }
    }
  )(req, res);
};

export { passport };
