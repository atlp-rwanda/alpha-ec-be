import { Sequelize, Model, DataTypes } from 'sequelize';
import { User, UserAttributes } from './user';
import { ProductOrder, ProductOrderAttributes } from './productOrder';

export interface OrderAttributes {
  id: string;
  userId: string;
  // productOrderIds?: Array<{ id: string; status: string }>;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderCreationAttributes
  extends Omit<OrderAttributes, 'id' | 'createdAt' | 'updatedAt'> {
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Represents a s in the system.
 */
export class Order extends Model<OrderAttributes, OrderCreationAttributes> {
  declare id: string;

  declare userId: string;

  // declare productOrderIds?: Array<{ id: string; status: string }>;

  declare status: string;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;

  declare buyer: UserAttributes;

  declare productsOrders: ProductOrderAttributes;

  /**
   * Associations.
   * @param {IModels} models - The models object containing all initialized models.
   * @returns {Object} An object representing association.
   */
  public static associate(models: {
    User: typeof User;
    ProductOrder: typeof ProductOrder;
  }) {
    Order.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'buyer',
    });
    Order.hasMany(models.ProductOrder, {
      foreignKey: 'orderId',
      as: 'productsOrders',
    });
  }

  // public static associate(models: { User: typeof User }) {
  //   Order.belongsTo(models.User, {
  //     foreignKey: 'userId',
  //     as: 'user',
  //   });
  // }

  /**
   * Overrides the default toJSON method to exclude sensitive fields.
   * @returns {Object} An object representing the product.
   */
  toJSON() {
    return {
      id: this.id,
      buyer: this.buyer,
      productsOrders: this.productsOrders,
      // productOrderIds: this.productOrderIds,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

const orderModel = (sequelize: Sequelize) => {
  Order.init(
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
      // productOrderIds: {
      //   type: DataTypes.ARRAY(DataTypes.JSON),
      //   allowNull: true,
      // },

      status: { type: DataTypes.STRING },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Order',
      tableName: 'orders',
      timestamps: true,
    }
  );

  return Order;
};

export default orderModel;
