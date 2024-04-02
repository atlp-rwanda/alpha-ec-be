import { Sequelize } from 'sequelize';
import UserModel, { User } from './user';

export { User};

const Models = (sequelize: Sequelize) => {
  const User = UserModel(sequelize);
  return {
    User,
  };
};
export default Models;
