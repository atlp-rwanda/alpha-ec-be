import { Sequelize } from 'sequelize';
import UserModel from './user';
import RoleModel from './role';
import ProductModel from './product';
import LogoutModel from './logout';

const Models = (sequelize: Sequelize) => {
  const User = UserModel(sequelize);
  const Role = RoleModel(sequelize);
  const Product = ProductModel(sequelize);
  const Logout = LogoutModel(sequelize);
  return {
    Role,
    User,
    Product,
    Logout,
  };
};

export default Models;
