import { Request, Response } from 'express';
import { sendResponse, signToken } from '../utils';
import { sendEmail } from '../utils/email';
import { checkLoginCredentials } from '../middleware/loginMiddleware';

/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await checkLoginCredentials(email, password);
    if (!user) {
      return sendResponse<null>(
        res,
        400,
        null,
        'User not found or Invalid Credentials'
      );
    }
    if (!user.verified) {
      const verificationToken = signToken({ email: user.email }, '15m');

      await user.save();
      const { name } = user;

      const mailOptions = {
        to: email,
        subject: 'Your Email verification',
        template: 'email',
        context: {
          name,
          verificationLink: `${process.env.SWAGGER_ROOT_URL}/api/users/verify-email/${verificationToken}`,
        },
      };
      await sendEmail(mailOptions);
      return sendResponse<null>(
        res,
        401,
        null,
        'Please check your email to verify your account before login.'
      );
    }

    // generate token
    const token = signToken({ id: user.id });

    return sendResponse<string>(res, 200, token, 'Logged In Successfully');
  } catch (error) {
    return sendResponse<null>(res, 500, null, 'Internal Server Error');
  }
};
export default loginController;
