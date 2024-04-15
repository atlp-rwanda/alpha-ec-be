import { DataTypes, Model, Sequelize } from 'sequelize';
import { Product } from './product';
import { Role } from './role';

export interface UserAttributes {
  id: string;
  name: string;
  email: string;
  gender: string;
  birthdate: string;
  preferedlanguage: string;
  preferedcurrency: string;
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

interface userCreationAttributes
  extends Omit<
    UserAttributes,
    | 'id'
    | 'gender'
    | 'birthdate'
    | 'preferedlanguage'
    | 'preferedcurrency'
    | 'createdAt'
    | 'updatedAt'
  > {
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Represents a user in the system.
 */
export class User extends Model<UserAttributes, userCreationAttributes> {
  declare id: string;

  declare name: string;

  declare email: string;

  declare phone: string;

  declare gender: string;

  declare birthdate: string;

  declare preferedlanguage: string;

  declare preferedcurrency: string;

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
      gender: this.gender,
      birthdate: this.birthdate,
      preferedlanguage: this.preferedlanguage,
      preferedcurrency: this.preferedcurrency,
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

const UserModel = (sequelize: Sequelize) => {
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
      gender: DataTypes.STRING,
      birthdate: DataTypes.STRING,
      preferedlanguage: DataTypes.STRING,
      preferedcurrency: DataTypes.STRING,
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
