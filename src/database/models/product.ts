import { Sequelize, Model, DataTypes } from 'sequelize';
import { User } from './user';
import { Category } from './category';
import { Wishlist } from './wishlist';

export interface ProductAttributes {
  id: string;
  name: string;
  slug: string;
  images: string[];
  categoryId: string;
  price: number;
  expiryDate: Date;
  bonus: string;
  status: boolean;
  quantity: number;
  sellerId: string;
  createdAt: Date;
  updatedAt: Date;
}
interface ProductCreationAttributes
  extends Omit<ProductAttributes, 'id' | 'createdAt' | 'updatedAt'> {
  createdAt?: Date;
  updatedAt?: Date;
}
/**
 * Represents a product in the system.
 */
export class Product extends Model<
  ProductAttributes,
  ProductCreationAttributes
> {
  declare id: string;

  declare name: string;

  declare slug: string;

  declare images: string[];

  declare categoryId: string;

  declare category: Category;

  declare price: number;

  declare expiryDate: Date;

  declare bonus: string;

  declare status: boolean;

  declare quantity: number;

  declare sellerId: string;

  declare seller: User;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;

  /**
   * Associations.
   * @param {IModels} models - The models object containing all initialized models.
   * @returns {Object} An object representing association.
   */
  public static associate(models: {
    User: typeof User;
    Category: typeof Category;
    Wishlist: typeof Wishlist;
  }) {
    Product.belongsTo(models.User, {
      foreignKey: 'sellerId',
      as: 'seller',
    });
    Product.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'category',
    });
    Product.hasMany(models.Wishlist, {
      foreignKey: 'productId',
      as: 'wishlist',
    });
  }

  /**
   * Overrides the default toJSON method to exclude sensitive fields.
   * @returns {Object} An object representing the product.
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      slug: this.slug,
      images: this.images,
      category: this.category,
      price: this.price,
      expiryDate: this.expiryDate,
      bonus: this.bonus,
      status: this.status,
      quantity: this.quantity,
      seller: this.seller,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
const ProductModel = (sequelize: Sequelize) => {
  Product.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      slug: DataTypes.STRING,
      images: DataTypes.ARRAY(DataTypes.STRING),
      categoryId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'categories',
          key: 'id',
        },
      },
      price: DataTypes.FLOAT,
      expiryDate: DataTypes.DATE,
      bonus: DataTypes.STRING,
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },

      quantity: DataTypes.FLOAT,
      sellerId: {
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
      modelName: 'Product',
      tableName: 'products',
      timestamps: true,
    }
  );
  return Product;
};
export default ProductModel;
