import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import config from './config';
import Database from '../database';

const { secret } = config();

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret,
};

passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      const currentTime = Math.floor(Date.now() / 1000);
      if (jwtPayload.exp < currentTime) {
        return done(null, false);
      }
      const user = await Database.User.findOne({
        where: { id: jwtPayload.id },
        include: [
          {
            model: Database.Role,
            as: 'role',
          },
        ],
      });

      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);
export default passport;
