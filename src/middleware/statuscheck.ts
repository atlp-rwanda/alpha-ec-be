import { Request } from 'express';
import Database from '../database';
import { verifyToken } from '../utils';

export const CheckUserCredential = async (req: Request) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (token) {
    const decoded = verifyToken(token);
    if (!decoded) {
      return undefined;
    }
    const userId = decoded.id;
    const user = await Database.User.findOne({
      where: { id: userId },
      include: [
        {
          model: Database.Role,
          as: 'role',
          attributes: ['id', 'name'],
        },
      ],
    });
    if (user) {
      return {
        id: userId,
        role: user.role.dataValues.name,
      };
    }
  }
};
