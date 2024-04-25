import { Sequelize, Model, DataTypes } from 'sequelize';
import { User } from './user';
import { Review } from './review';

export interface ReplyAttributes {
  id: string;
  reviewId: string;
  userId: string;
  feedback: string;
  createdAt: Date;
  updatedAt: Date;
}
interface ReplyCreationAttributes
  extends Omit<ReplyAttributes, 'id' | 'createdAt' | 'updatedAt'> {
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Represents a product in the system.
 */
export class Reply extends Model<ReplyAttributes, ReplyCreationAttributes> {
  declare id: string;

  declare reviewId: string;

  declare userId: string;

  declare feedback: string;

  declare repliedBy: User;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;

  /**
   * Associations.
   * @param {IModels} models - The models object containing all initialized models.
   * @returns {Object} An object representing association.
   */
  public static associate(models: {
    User: typeof User;
    Review: typeof Review;
    Reply: typeof Reply;
  }) {
    Reply.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'repliedBy',
    });
    Reply.belongsTo(models.Review, {
      foreignKey: 'reviewId',
      as: 'repliedTo',
    });
  }

  /**
   * Overrides the default toJSON method to exclude the sellerId field.
   * @returns {Object} An object representing the product, excluding the sellerId.
   */
  toJSON() {
    return {
      id: this.id,
      reviewId: undefined,
      userId: undefined,
      repliedBy: this.repliedBy,
      feedback: this.feedback,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

const ReplyModel = (sequelize: Sequelize) => {
  Reply.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      feedback: DataTypes.STRING,
      reviewId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'reviews',
          key: 'id',
        },
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Reply',
      tableName: 'replies',
      timestamps: true,
    }
  );

  return Reply;
};
export default ReplyModel;
