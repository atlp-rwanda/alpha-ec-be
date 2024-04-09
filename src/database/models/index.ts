import { Sequelize } from 'sequelize';
import UserModel from './user';
import ProductModel from './product';

const Models = (sequelize: Sequelize) => {
  const User = UserModel(sequelize);
  const Product = ProductModel(sequelize);

  return {
    User,
    Product,
  };
};

export default Models;
