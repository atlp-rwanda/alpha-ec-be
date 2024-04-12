import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy'; // Import speakeasy
import bcrypt from 'bcrypt'; // Import bcrypt
import { sendResponse } from '../utils';
import config from '../config/config';
import { checkLoginCredentials } from '../middleware/loginMiddleware';
import Database from '../database';
import sendEmail from '../utils/sendEmail';
import { handleCookies } from '../utils/handleCookie';

const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await checkLoginCredentials(email, password);
    if (!user) {
      return sendResponse<null>(res, 400, null, 'User not found');
    }

    const role = await Database.Role.findOne({
      where: { id: user.roleId },
    });
    const roleName = role?.name ?? 'Unknown';
    req.body.role = roleName;

    const { secret } = config();
    const token = jwt.sign({ id: user.id }, secret, { expiresIn: '2h' });

    let mailOptions;
    let secretOTP;
    let OTPtoken;
    let salt;
    let hashedToken;
    let encodedToken;

    switch (roleName) {
      case 'buyer':
        mailOptions = {
          email: req.body.email,
          subject: 'Login Successful',
          text: 'You have successfully logged in.',
          html: '',
        };
        await sendEmail(mailOptions);
        break;
      case 'seller':
        secretOTP = speakeasy.generateSecret({ length: 15 });
        OTPtoken = speakeasy.totp({
          secret: secretOTP.base32,
          encoding: 'base32',
          time: Math.floor(Date.now() / 1000 / 90),
          step: 90,
        });
        res.cookie('OTPtoken', OTPtoken, { httpOnly: true });

        salt = await bcrypt.genSalt(10);
        hashedToken = await bcrypt.hash(OTPtoken, salt);

        encodedToken = Buffer.from(hashedToken).toString('base64');
        await handleCookies({
          duration: 5,
          cookieVariable: 'onloginToken',
          cookieValue: encodedToken,
          idBasedVariables: 'onloggingUserid',
          id: user.id,
          res,
        });

        mailOptions = {
          email: req.body.email,
          subject: 'Two-Factor Authentication',
          text: `Your OTP for login is: ${OTPtoken}. It will expire in 5 minutes.`,
          html: '',
        };
        await sendEmail(mailOptions);
        break;
      case 'admin':
        return sendResponse<string>(res, 200, token, 'Admin Login Successful');
      default:
        return sendResponse<null>(res, 400, null, 'Invalid role');
    }

    return sendResponse(res, 200, null, 'OTP Email sent');
  } catch (error) {
    return sendResponse<null>(res, 500, null, 'Internal Server Error');
  }
};

export default loginController;
