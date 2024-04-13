import { Sequelize } from 'sequelize';
import UserModel from './user';
import RoleModel from './role';
import ProductModel from './product';
import LogoutModel from './logout';
import CategoryModel from './category';

const Models = (sequelize: Sequelize) => {
  const User = UserModel(sequelize);
  const Role = RoleModel(sequelize);
  const Product = ProductModel(sequelize);
  const Category = CategoryModel(sequelize);

  const Logout = LogoutModel(sequelize);
  return {
    Role,
    User,
    Product,
    Category,
    Logout,
  };
};

export default Models;
