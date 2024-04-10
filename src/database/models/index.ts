import { Sequelize } from 'sequelize';
import UserModel from './user';
import RoleModel from './role';
import ProductModel from './product';

const Models = (sequelize: Sequelize) => {
  const User = UserModel(sequelize);
  const Role = RoleModel(sequelize);
  const Product = ProductModel(sequelize);
  return {
    Role,
    User,
    Product,
  };
};

export default Models;
