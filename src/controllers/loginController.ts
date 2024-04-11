import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { sendResponse } from '../utils';
import config from '../config/config';
import { checkLoginCredentials } from '../middleware/loginMiddleware';

/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    // passing password and email  to middleware function
    const user = await checkLoginCredentials(email, password);
    if (!user) {
      return sendResponse<null>(res, 400, null, 'User not found');
    }

    const { secret } = config();
    const token = jwt.sign({ id: user.id }, secret, { expiresIn: '2h' });
    return sendResponse<string>(res, 200, token, 'Logged In Successfully');
  } catch (error) {
    return sendResponse<null>(res, 500, null, 'Internal Server Error');
  }
};

export default loginController;
