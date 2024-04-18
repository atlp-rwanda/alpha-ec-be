import { Request, Response } from 'express';
import { sendResponse } from './response';
import { UserData, sendOtp } from '../controllers/OTPcontroller';
import Database from '../database';
import { Role } from '../database/models/role';
import { signToken } from './jwtToken';

const Checkrole = async (
  id: string,
  email: string,
  req: Request,
  res: Response
) => {
  const user = (await Database.User.findOne({
    where: {
      email,
    },
  })) as unknown as UserData;

  const userRole = await Database.User.findOne({
    where: { id: user.dataValues.id },
    include: [
      {
        model: Role,
        as: 'role',
      },
    ],
  });
  if (userRole?.role.name === 'seller') {
    sendOtp(req, res, email);
  } else {
    const token = signToken({ id: user.dataValues.id });

    return sendResponse<string>(res, 200, token, 'Logged In Successfully');
  }
};
export default Checkrole;
