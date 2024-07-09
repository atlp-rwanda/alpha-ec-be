/* eslint-disable require-jsdoc */
import { UUID } from 'crypto';
import { Model, DataTypes, Sequelize } from 'sequelize';
import { User } from './user';

export interface NotificationAttributes {
  id: string;
  message: string;
  userId: string;
  sellerId: string;
  isRead: boolean;
  event: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface NotificationCreationAttributes
  extends Omit<NotificationAttributes, 'id'> {
  id?: string;
}

export class Notification
  extends Model<NotificationAttributes, NotificationCreationAttributes>
  implements NotificationAttributes
{
  public id!: UUID;

  public message!: string;

  declare userId: string;

  declare sellerId: string;

  declare isRead: boolean;

  declare event: string;

  declare createdAt?: Date;

  declare updatedAt?: Date;

  /**
   * Associations.
   * @param {IModels} models
   * @returns {Object} An object representing association.
   */
  static associate(models: { User: typeof User }) {
    Notification.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  }

  /**
   * Associations.
   * @param {models} models
   * @returns {Object} An object representing association.
   */
  toJSON() {
    return {
      id: this.id,
      message: this.message,
      userId: this.userId,
      sellerId: this.sellerId,
      isRead: this.isRead,
      event: this.event,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
export default (sequelize: Sequelize) => {
  Notification.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      message: DataTypes.STRING,
      isRead: DataTypes.BOOLEAN,
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      sellerId: DataTypes.UUID,
      event: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'notification',
      freezeTableName: true,
      timestamps: true,
    }
  );

  return Notification;
};
