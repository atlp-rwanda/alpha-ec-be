import { Sequelize } from 'sequelize';
import UserModel, { User } from './user';

export { User };

const Models = (sequelize: Sequelize) => {
  // eslint-disable-next-line no-shadow
  const User = UserModel(sequelize);
  return {
    User,
  };
};
export default Models;
