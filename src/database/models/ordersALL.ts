import { Sequelize, Model, DataTypes } from 'sequelize';

export interface OrderInterface {
  orderId: string;
}

export interface allOrderAttributes {
  id: string;
  buyerId: string;
  orders: string;
  status: string;
}
// eslint-disable-next-line require-jsdoc
class productOrder
  extends Model<allOrderAttributes>
  implements allOrderAttributes
{
  declare id: string;

  declare buyerId: string;

  declare orders: string;

  declare status: string;

  // eslint-disable-next-line require-jsdoc
}
const productOrderModel = (sequelize: Sequelize) => {
  productOrder.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      buyerId: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      orders: {
        allowNull: true,
        type: DataTypes.STRING,
        references: {
          model: 'users',
          key: 'id',
        },
      },

      status: {
        allowNull: false,
        type: DataTypes.STRING,
        defaultValue: 'pending',
      },
    },
    {
      sequelize,
      modelName: 'OrderAll',
      tableName: 'all-orders',
      timestamps: true,
    }
  );
  return productOrder;
};
export default productOrderModel;
