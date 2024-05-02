import { Sequelize, Model, DataTypes } from 'sequelize';
import { User } from './user';

export interface OrderInterface {
  productId: string;
}
export interface ordersAttributes {
  id: string;
  userId: string;
  items: Array<OrderInterface>;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ordersCreationAttributes
  extends Omit<ordersAttributes, 'id' | 'createdAt' | 'updatedAt'> {
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Represents a s in the system.
 */
export class Orders extends Model<ordersAttributes, ordersCreationAttributes> {
  declare id: string;

  declare userId: string;

  declare items: Array<OrderInterface>;

  declare status: string;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;

  /**
   * Associations.
   * @param {IModels} models - The models object containing all initialized models.
   * @returns {Object} An object representing association.
   */
  public static associate(models: { User: typeof User }) {
    Orders.belongsTo(models.User, {
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
      buyerId: this.userId,
      items: this.items,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

const orderModel = (sequelize: Sequelize) => {
  Orders.init(
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
          key: 'name',
        },
      },
      items: { type: DataTypes.ARRAY(DataTypes.JSON) },

      status: { type: DataTypes.STRING },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Orders',
      tableName: 'orders',
      timestamps: true,
    }
  );

  return Orders;
};

export default orderModel;
