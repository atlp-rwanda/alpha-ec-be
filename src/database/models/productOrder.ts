import { Sequelize, Model, DataTypes } from 'sequelize';
import { User, UserAttributes } from './user';
import { Order } from './order';
import { Product, ProductAttributes } from './product';
// import { Product } from './product';

export interface ProductOrderAttributes {
  id: string;
  orderId: string;
  userId: string;
  sellerId: string | undefined;
  productId: string;
  quantity: number;
  status: string;
}
interface ProductOrderCreationAttributes
  extends Omit<ProductOrderAttributes, 'id' | 'createdAt' | 'updatedAt'> {
  createdAt?: Date;
  updatedAt?: Date;
}
// eslint-disable-next-line require-jsdoc
export class ProductOrder extends Model<
  ProductOrderAttributes,
  ProductOrderCreationAttributes
> {
  declare id: string;

  declare orderId: string;

  declare userId: string;

  declare sellerId: string | undefined;

  declare productId: string;

  declare quantity: number;

  declare status: string;

  declare orderedProduct: ProductAttributes;

  declare orderBuyer: UserAttributes;

  declare prodOrderSeller: UserAttributes;

  // eslint-disable-next-line require-jsdoc
  public static associate(models: {
    User: typeof User;
    Order: typeof Order;
    Product: typeof Product;
  }) {
    ProductOrder.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'orderBuyer',
    });
    ProductOrder.belongsTo(models.Order, {
      foreignKey: 'orderId',
      as: 'mainOrder',
    });
    ProductOrder.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'orderedProduct',
    });
    ProductOrder.belongsTo(models.User, {
      foreignKey: 'sellerId',
      as: 'prodOrderSeller',
    });
  }

  /**
   * Overrides the default toJSON method to exclude sensitive fields.
   * @returns {Object} An object representing the product.
   */
  toJSON() {
    return {
      id: this.id,
      orderBuyer: this.orderBuyer,
      prodOrderSeller: this.prodOrderSeller,
      orderedProduct: this.orderedProduct,
      quantity: this.quantity,
      status: this.status,
    };
  }
}

const ProductOrderModel = (sequelize: Sequelize) => {
  ProductOrder.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: true,
      },
      orderId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'orders',
          key: 'id',
        },
      },
      userId: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      sellerId: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      productId: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
          model: 'products',
          key: 'id',
        },
      },
      quantity: {
        allowNull: false,
        type: DataTypes.NUMBER,
      },
      status: {
        allowNull: false,
        type: DataTypes.STRING,
        defaultValue: 'pending',
      },
    },
    {
      sequelize,
      modelName: 'ProductOrder',
      tableName: 'productOrders',
      timestamps: true,
    }
  );
  return ProductOrder;
};
export default ProductOrderModel;
