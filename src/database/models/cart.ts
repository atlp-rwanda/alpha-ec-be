import { Sequelize, Model, DataTypes } from 'sequelize';
import { User } from './user';

export interface cartProductInterface {
  productId: string;
  quantity: number;
}
export interface cartAttributes {
  id: string;
  userId: string;
  products: Array<cartProductInterface>;
  totalprice: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface cartCreationAttributes
  extends Omit<cartAttributes, 'id' | 'createdAt' | 'updatedAt'> {
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Represents a s in the system.
 */
export class Cart extends Model<cartAttributes, cartCreationAttributes> {
  declare id: string;

  declare userId: string;

  declare products: Array<cartProductInterface>;

  declare totalprice: number;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;

  /**
   * Associations.
   * @param {IModels} models - The models object containing all initialized models.
   * @returns {Object} An object representing association.
   */
  public static associate(models: { User: typeof User }) {
    Cart.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  }

  /**
   * Overrides the default toJSON method to exclude sensitive fields.
   * @returns {Object} An object representing the product.
   */
  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      products: this.products,
      totalprice: this.totalprice,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

const cartModel = (sequelize: Sequelize) => {
  Cart.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      products: { type: DataTypes.ARRAY(DataTypes.JSON) },

      totalprice: { type: DataTypes.FLOAT },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Cart',
      tableName: 'carts',
      timestamps: true,
    }
  );

  return Cart;
};

export default cartModel;
