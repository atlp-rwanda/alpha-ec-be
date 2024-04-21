import { Sequelize } from 'sequelize';
import UserModel from './user';
import RoleModel from './role';
import ProductModel from './product';
import LogoutModel from './logout';
import WishlistModel from './wishlist';
import initializeChatModel from './chat';
import CategoryModel from './category';
import cartModel from './cart';

const Models = (sequelize: Sequelize) => {
  const User = UserModel(sequelize);
  const Role = RoleModel(sequelize);
  const Product = ProductModel(sequelize);
  const Category = CategoryModel(sequelize);
  const Wishlist = WishlistModel(sequelize);
  const Cart = cartModel(sequelize);

  const Logout = LogoutModel(sequelize);
  const Chat = initializeChatModel(sequelize);
  return {
    Role,
    User,
    Product,
    Category,
    Logout,
    Chat,
    Wishlist,
    Cart,
  };
};

export default Models;
