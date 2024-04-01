import { Sequelize } from 'sequelize';
import UserModel from './user';

const Models = (sequelize: Sequelize) => {
  const User = UserModel(sequelize);

  return {
    User,
  };
};
export default Models;
