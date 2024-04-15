/* eslint-disable require-jsdoc */
import { Model, DataTypes, Sequelize } from 'sequelize';
import { Product } from './product';

export interface CategoryAttributes {
  id: string;
  name: string;
  description: string;
}

export interface CatCreationAttributes extends Omit<CategoryAttributes, 'id'> {
  id?: string;
}

export class Category
  extends Model<CategoryAttributes, CatCreationAttributes>
  implements CategoryAttributes
{
  declare id: string;

  declare name: string;

  declare description: string;

  public static associate(models: { Product: typeof Product }) {
    Category.hasMany(models.Product, {
      foreignKey: 'categoryId',
      as: 'products',
    });
  }

  /**
   * Overrides the default toJSON method to exclude the password field.
   * @returns {Object} An object representing the user, excluding the password.
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
    };
  }
}

const CategoryModel = (sequelize: Sequelize) => {
  Category.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Category',
      tableName: 'categories',
      timestamps: true,
    }
  );

  return Category;
};

export default CategoryModel;
