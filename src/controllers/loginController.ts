import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import speakeasy from 'speakeasy';
import jwt from 'jsonwebtoken';
import Database from '../database';
import { sendResponse } from '../utils';
import config from '../config/config';
import sendEmail from '../utils/sendEmail';
import { handleCookies } from '../utils/handleCookie';

/// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// eslint-disable-next-line require-jsdoc
export async function checkUserCredentials(
  email: string,
  password: string,
  // eslint-disable-next-line @typescript-eslint/ban-types
  done: Function
) {
  try {
    // checking if user with this email exists in database

    const user = await Database.User.findOne({
      where: { email },
    });

    // comparing password entered with password stored in database

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return done(null, false, { message: 'User not found' });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}

passport.use(
  new LocalStrategy({ usernameField: 'email' }, checkUserCredentials)
);

const validatingUser = async (req: Request, res: Response) => {
  passport.authenticate(
    'local',
    { session: false },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (err: any, user: any) => {
      // test if uer not found

      if (!user) return sendResponse<null>(res, 400, null, 'User not found');

      // generate token

      const { secret } = config();
      const token = jwt.sign({ id: user.id }, secret, { expiresIn: '2h' });

      // create two factor secrete

      const secretOTP = await speakeasy.generateSecret({ length: 15 });

      // generate OTPtoken

      const OTPtoken = await speakeasy.totp({
        secret: secretOTP.base32,
        encoding: 'base32',
        time: Math.floor(Date.now() / 1000 / 90),
        step: 90,
      });
      res.cookie('OTPtoken', OTPtoken, { httpOnly: true });

      // create object to save 2fa token and corresponding

      const salt = await bcrypt.genSalt(10);
      const hashedToken = await bcrypt.hash(OTPtoken, salt);
      const mailOptions = {
        email: req.body.email,
        subject: 'verification code',
        text: 'Hello thank you for loging in',
        html: `Your verification code is: ${OTPtoken} and it will expire in <b>5 minutes</b>`,
      };

      // mailer sender implemantation
      await sendEmail(mailOptions);

      // creating mail options object
      const encodedToken = Buffer.from(hashedToken).toString('base64');
      await handleCookies({
        duration: 5,
        cookieVariable: 'onloginToken',
        cookieValue: encodedToken,
        idBasedVariables: 'onloggingUserid',
        id: user.id,
        res,
      });

      return sendResponse<string>(res, 200, token, 'OTP Email sent');
    }
  )(req, res);
};

export default validatingUser;
