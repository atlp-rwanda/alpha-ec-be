import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { checkUserCredentials } from '../controllers/loginController';

export default passport.use(
  new LocalStrategy({ usernameField: 'email' }, checkUserCredentials)
);
