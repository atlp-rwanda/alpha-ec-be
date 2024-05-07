import { Op } from 'sequelize';
import Database from '../database';
import { passwordExpirationNotification } from '../utils/passwordExpirationCheck';

const checkPasswordExpiration = async () => {
  const getAllUsers = await Database.User.findAll({
    include: [
      {
        model: Database.Role,
        as: 'role',
        where: {
          name: {
            [Op.ne]: 'admin',
          },
        },
      },
    ],
  });
  getAllUsers.forEach(singleUser => {
    const lastTimePasswordUpdated = new Date(
      singleUser.lastTimePasswordUpdated
    );
    passwordExpirationNotification(lastTimePasswordUpdated, singleUser.email);
  });
};

export default checkPasswordExpiration;
