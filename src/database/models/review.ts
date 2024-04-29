import { Sequelize, Model, DataTypes } from 'sequelize';
import { User } from './user';
import { Product } from './product';
import { Reply } from './reply';

export interface ReviewAttributes {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  feedback: string;
  repliesCount?: number;
  createdAt: Date;
  updatedAt: Date;
}
interface ReviewCreationAttributes
  extends Omit<ReviewAttributes, 'id' | 'createdAt' | 'updatedAt'> {
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Represents a product in the system.
 */
export class Review extends Model<ReviewAttributes, ReviewCreationAttributes> {
  declare id: string;

  declare productId: string;

  declare userId: string;

  declare reviewedBy: User;

  declare replies: Reply;

  declare rating: number;

  declare feedback: string;

  declare repliesCount: number;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;

  /**
   * Associations.
   * @param {IModels} models - The models object containing all initialized models.
   * @returns {Object} An object representing association.
   */
  public static associate(models: {
    User: typeof User;
    Product: typeof Product;
    Reply: typeof Reply;
  }) {
    Review.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'reviewedBy',
    });
    Review.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'reviewedProduct',
    });
    Review.hasMany(models.Reply, {
      foreignKey: 'reviewId',
      as: 'replies',
    });
  }

  /**
   * Overrides the default toJSON method to exclude the sellerId field.
   * @returns {Object} An object representing the product, excluding the sellerId.
   */
  toJSON() {
    return {
      id: this.id,
      productId: undefined,
      userId: undefined,
      reviewedBy: this.reviewedBy,
      rating: this.rating,
      feedback: this.feedback,
      repliesCount: this.repliesCount,
      replies: this.replies,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

const ReviewModel = (sequelize: Sequelize) => {
  Review.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      rating: DataTypes.FLOAT,
      feedback: DataTypes.STRING,
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'products',
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
      repliesCount: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Review',
      tableName: 'reviews',
      timestamps: true,
    }
  );

  return Review;
};
export default ReviewModel;
