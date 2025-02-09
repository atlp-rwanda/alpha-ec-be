import { Sequelize } from 'sequelize';
import UserModel from './user';
import RoleModel from './role';
import NotificationModel from './notification';
import ProductModel from './product';
import LogoutModel from './logout';
import WishlistModel from './wishlist';
import initializeChatModel from './chat';
import ReviewModel from './review';
import ReplyModel from './reply';
import CategoryModel from './category';
import cartModel from './cart';
import orderModel from './order';
import ProductOrderModel from './productOrder';

const Models = (sequelize: Sequelize) => {
  const User = UserModel(sequelize);
  const Role = RoleModel(sequelize);
  const Product = ProductModel(sequelize);
  const Category = CategoryModel(sequelize);
  const Wishlist = WishlistModel(sequelize);
  const Review = ReviewModel(sequelize);
  const Reply = ReplyModel(sequelize);
  const Cart = cartModel(sequelize);
  const Notification = NotificationModel(sequelize);
  const Order = orderModel(sequelize);
  const ProductOrder = ProductOrderModel(sequelize);
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
    Review,
    Reply,
    Cart,
    Notification,
    Order,
    ProductOrder,
  };
};

export default Models;
