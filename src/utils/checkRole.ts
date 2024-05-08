import { Request, Response } from 'express';
import { sendResponse } from './response';
import { sendOtp } from '../controllers/OTPcontroller';
import Database from '../database';
import { Role } from '../database/models/role';
import { signToken } from './jwtToken';
import { UserAttributes } from '../database/models/user';

const Checkrole = async (
  id: string,
  email: string,
  req: Request,
  res: Response
) => {
  const user: UserAttributes | null = await Database.User.findOne({
    where: {
      email,
    },
    include: [
      {
        model: Role,
        as: 'role',
      },
    ],
  });

  if (!user) return;

  if (user.role?.name === 'seller') {
    sendOtp(req, res, email);
  } else {
    const token = signToken({ id: user.id });

    return sendResponse<string>(res, 200, token, 'Logged In Successfully');
  }
};
export default Checkrole;
