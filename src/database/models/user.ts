import { DataTypes, Model, Sequelize } from 'sequelize';
import { Product } from './product';
import { Role } from './role';

export interface UserAttributes {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  googleId?: string;
  photoUrl?: string;
  verified?: boolean;
  createdAt: Date;
  updatedAt: Date;
  roleId?: string;
  role?: Role;
}

interface UserCreationAttributes
  extends Omit<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Represents a user in the system.
 */
export class User extends Model<UserAttributes, UserCreationAttributes> {
  declare id: string;

  declare name: string;

  declare email: string;

  declare phone: string;

  declare address: string;

  declare password: string;

  declare googleId: string;

  declare photoUrl: string;

  declare verified: boolean;

  declare roleId?: string;

  declare role: Role;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;

  /**
   * Represents a product in the system.
   */

  /**
   * Overrides the default toJSON method to exclude the password field.
   * @returns {Object} An object representing the user, excluding the password.
   */
  /**
   * Associations.
   * @param {IModels} models - The models object containing all initialized models.
   * @returns {Object} An object representing association.
   */
  public static associate(models: {
    Product: typeof Product;
    Role: typeof Role;
  }) {
    User.hasMany(models.Product, {
      foreignKey: 'sellerId',
      as: 'products',
    });
    User.belongsTo(models.Role, { foreignKey: 'roleId', as: 'role' });
  }

  /**
   * Overrides the default toJSON method to exclude the password field.
   * @returns {Object} An object representing the user, excluding the password.
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      address: this.address,
      password: undefined,
      googleId: this.googleId,
      photoUrl: this.photoUrl,
      verified: this.verified,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export const UserModel = (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      address: DataTypes.STRING,
      password: DataTypes.STRING,
      googleId: DataTypes.STRING,
      photoUrl: DataTypes.STRING,
      verified: DataTypes.BOOLEAN,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      roleId: {
        type: DataTypes.UUID,
        allowNull: true,
        defaultValue: DataTypes.UUIDV4, // Change the default value to an UUID
        references: {
          model: 'Roles',
          key: 'id', // Change to the correct foreign key of Role model
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: true,
    }
  );

  return User;
};

export default UserModel;
