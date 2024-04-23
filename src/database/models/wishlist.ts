/* eslint-disable require-jsdoc */

import { Model, DataTypes, Sequelize } from 'sequelize';
import { Product } from './product';

export interface WishlistAttributes {
  id: string;
  userId: string;
  productId: string;
}
export interface WishlistCreationAttributes
  extends Omit<WishlistAttributes, 'id'> {
  id?: string;
}
/**
 * Overrides the default toJSON method to exclude the password field.
 * @returns {Object} An object representing the user, excluding the password.
 */
export class Wishlist
  extends Model<WishlistAttributes, WishlistCreationAttributes>
  implements WishlistAttributes
{
  declare id: string;

  declare userId: string;

  declare productId: string;

  declare product: Product;

  /**
   * Overrides the default toJSON method to exclude the password field.
   * @returns {Object} An object representing the user, excluding the password.
   */

  public static associate(models: { Product: typeof Product }) {
    Wishlist.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product',
    });
  }

  /**
   * Overrides the default toJSON method to exclude the password field.
   * @returns {Object} An object representing the user, excluding the password.
   */
  toJSON() {
    return {
      ...this.get(),
    };
  }
}
const WishlistModel = (sequelize: Sequelize) => {
  Wishlist.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: DataTypes.UUID,
      productId: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: 'Wishlist',
      tableName: 'wishlists',
      timestamps: true,
    }
  );
  return Wishlist;
};
export default WishlistModel;
