/* eslint-disable no-console */
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { UserAttributes } from '../database/models/user';
import { sendResponse, signToken } from '../utils';
import Database from '../database';

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

interface GoogleProfile {
  id: string;
  displayName: string;
  name: {
    familyName: string;
    givenName: string;
  };
  emails: Array<{
    value: string;
    verified?: boolean;
  }>;
  photos: Array<{
    value: string;
  }>;
}

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
        const profile = req.user as GoogleProfile;

        if (!profile || !profile.emails || profile.emails.length === 0) {
          console.error('User profile not found');
          return sendResponse(
            res,
            401,
            { error: 'User profile not found' },
            'User profile not found'
          );
        }

        const email = profile.emails[0].value;

        const newUserAttributes: Partial<UserAttributes> = {
          name: `${profile.name?.givenName} ${profile.name?.familyName}` || '',
          googleId: profile.id,
          photoUrl: profile.photos?.[0]?.value || '',
          email,
          verified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        try {
          const newUser = await Database.User.create(
            newUserAttributes as UserAttributes
          );
          const role = await Database.Role.findByPk(newUser.roleId);
          const token = signToken({ id: newUser.id, role: role?.name });
          const frontendurl = `${process.env.FRONTEND_DOMAIN}`;
          return res.redirect(`${frontendurl}?token=${token}`);
        } catch (err: unknown) {
          return sendResponse(
            res,
            500,
            { error: 'Failed to create new user' },
            'Failed to create new user'
          );
        }
      } else {
        try {
          const role = await Database.Role.findByPk(user.roleId);
          const token = signToken({ id: user.id, role: role?.name });
          const frontendurl = `${process.env.FRONTEND_DOMAIN}`;
          return res.redirect(`${frontendurl}?token=${token}`);
        } catch (err: unknown) {
          console.error('Error generating token for user:', err);
          return res.redirect(`${process.env.FRONTEND_DOMAIN}/login`);
        }
      }
    }
  )(req, res);
};

export { passport };
