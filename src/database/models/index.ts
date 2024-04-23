import { Sequelize } from 'sequelize';
import UserModel from './user';
import RoleModel from './role';
import ProductModel from './product';
import CategoryModel from './category';
import LogoutModel from './logout';
import WishlistModel from './wishlist';

const Models = (sequelize: Sequelize) => {
  const User = UserModel(sequelize);
  const Role = RoleModel(sequelize);
  const Product = ProductModel(sequelize);
  const Category = CategoryModel(sequelize);
  const Wishlist = WishlistModel(sequelize);

  const Logout = LogoutModel(sequelize);
  return {
    Role,
    User,
    Product,
    Category,
    Logout,
    Wishlist,
  };
};

export default Models;
