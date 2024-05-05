/* eslint-disable require-jsdoc */
import { UUID } from 'crypto';
import { Model, DataTypes, Sequelize } from 'sequelize';
import { User } from './user';

export interface NotificationAttributes {
  id: string;
  message: string;
  userId: string;
  isRead: boolean;
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

  declare isRead: boolean;

  /**
   * Associations.
   * @param {IModels} models - The models object containing all initialized models.
   * @returns {Object} An object representing association.
   */
  static associate(models: { User: typeof User }) {
    Notification.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'reviewedBy',
    });
  }

  /**
   * Associations.
   * @param {models} models - The models object containing all initialized models.
   * @returns {Object} An object representing association.
   */
  toJSON() {
    return {
      id: this.id,
      message: this.message,
      userId: undefined,
      isRead: this.isRead,
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
    },
    {
      sequelize,
      modelName: 'notification',
      freezeTableName: true,
    }
  );

  return Notification;
};
