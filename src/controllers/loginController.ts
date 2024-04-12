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

/**
 * Validates user credentials and generates appropriate response.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @param {Function} done - The callback function.
 * @returns {Promise<void>} - A promise representing the completion of the validation process.
 */
export async function checkUserCredentials(
  email: string,
  password: string,
  // eslint-disable-next-line @typescript-eslint/ban-types
  done: Function
): Promise<void> {
  try {
    // Checking if user with this email exists in database
    const user = await Database.User.findOne({
      where: { email },
    });

    // Comparing password entered with password stored in database
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
      // Test if user not found
      if (!user) return sendResponse<null>(res, 400, null, 'User not found');

      try {
        // Fetching the role associated with the user from the database
        const role = await Database.Role.findOne({
          where: { id: user.roleId },
        });

        // Safely access the 'name' property using optional chaining
        const roleName = role?.name;

        // Assign roleName to req.body.role or provide a default value if role is null
        req.body.role = roleName ?? 'Unknown';

        // Generate token
        const { secret } = config();
        const token = jwt.sign({ id: user.id }, secret, { expiresIn: '2h' });

        // Send appropriate email based on the user's role using switch-case
        let mailOptions;
        // Declare variables outside of switch-case
        let secretOTP;
        let OTPtoken;
        let hashedToken;
        let salt;
        let encodedToken;

        switch (roleName) {
          case 'buyer':
            // Set mail options for buyer
            mailOptions = {
              email: req.body.email,
              subject: 'Login Successful',
              text: 'You have successfully logged in.',
              html: '',
            };

            // Send email
            await sendEmail(mailOptions);
            break;
          case 'seller':
            // Generate two-factor secret and OTP token for sellers
            secretOTP = speakeasy.generateSecret({ length: 15 });
            OTPtoken = speakeasy.totp({
              secret: secretOTP.base32,
              encoding: 'base32',
              time: Math.floor(Date.now() / 1000 / 90),
              step: 90,
            });
            res.cookie('OTPtoken', OTPtoken, { httpOnly: true });

            // Save hashed OTP token to the database
            salt = await bcrypt.genSalt(10);
            hashedToken = await bcrypt.hash(OTPtoken, salt);

            // Set cookies for seller
            encodedToken = Buffer.from(hashedToken).toString('base64');
            await handleCookies({
              duration: 5,
              cookieVariable: 'onloginToken',
              cookieValue: encodedToken,
              idBasedVariables: 'onloggingUserid',
              id: user.id,
              res,
            });

            // Set mail options for seller with OTP
            mailOptions = {
              email: req.body.email,
              subject: 'Two-Factor Authentication',
              text: `Your OTP for login is: ${OTPtoken}. It will expire in 5 minutes.`,
              html: '',
            };

            // Send email
            await sendEmail(mailOptions);
            break;
          case 'admin':
            // For admin, return success and token in response
            return sendResponse<string>(
              res,
              200,
              token,
              'Admin Login Successful'
            );
          default:
            return sendResponse<null>(res, 400, null, 'Invalid role');
        }

        return sendResponse(res, 200, null, 'OTP Email sent');
      } catch (error) {
        return sendResponse<null>(res, 500, null, 'Internal Server Error');
      }
    }
  )(req, res);
};

export default validatingUser;
