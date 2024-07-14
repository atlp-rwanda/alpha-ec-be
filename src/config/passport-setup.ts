/* eslint-disable no-console */
import passport from 'passport';
import {
  Strategy as GoogleStrategy,
  StrategyOptionsWithRequest,
} from 'passport-google-oauth20';
import { User, UserAttributes } from '../database/models/user';
import Database from '../database';

const googleStrategyOptions: StrategyOptionsWithRequest = {
  clientID: process.env.GOOGLE_CLIENT_ID as string,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
  passReqToCallback: true,
};
passport.use(
  new GoogleStrategy(
    googleStrategyOptions,
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        if (!profile.emails || profile.emails.length === 0) {
          return done(
            new Error('Email not found in the Google profile'),
            undefined
          );
        }

        const email = profile.emails[0].value;

        const existingUser = await Database.User.findOne({ where: { email } });

        if (existingUser) {
          return done(null, existingUser);
        }

        const newUserAttributes: Partial<UserAttributes> = {
          name: `${profile.name?.givenName} ${profile.name?.familyName}` || '',
          googleId: profile.id,
          photoUrl: profile.photos?.[0]?.value || '',
          email,
          verified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const newUser = await Database.User.create(
          newUserAttributes as UserAttributes
        );

        return done(null, newUser);
      } catch (error) {
        done(error as Error, undefined);
      }
    }
  )
);

passport.serializeUser((user: unknown, done) => {
  const typedUser = user as User;
  done(null, typedUser.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
