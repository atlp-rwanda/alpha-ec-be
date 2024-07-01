/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable require-jsdoc */
import {
  DataTypes,
  Model,
  Sequelize,
  WhereAttributeHashValue,
} from 'sequelize';
import { Product } from './product';
import { Role } from './role';
import { Chat } from './chat';
import { Reply } from './reply';
import { Review } from './review';
import { Cart } from './cart';
import { ProductOrder } from './productOrder';

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
  status: boolean;
  lastTimePasswordUpdated: Date;
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
    | 'lastTimePasswordUpdated'
  > {
  createdAt?: Date;
  updatedAt?: Date;
  lastTimePasswordUpdated?: Date;
}

/**
 * Represents a user in the system.
 */
export class User extends Model<UserAttributes, userCreationAttributes> {
  static lastTimePasswordUpdated: WhereAttributeHashValue<Date>;

  sellerId: any;

  static forEach(arg0: (user: any) => void) {
    throw new Error('Method not implemented.');
  }

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

  declare status: boolean;

  declare lastTimePasswordUpdated: Date;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static find: any;

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
    Chat: typeof Chat;
    Review: typeof Review;
    Reply: typeof Reply;
    Cart: typeof Cart;
    ProductOrder: typeof ProductOrder;
  }) {
    User.hasMany(models.Product, {
      foreignKey: 'sellerId',
      as: 'products',
    });
    User.hasMany(models.Review, {
      foreignKey: 'userId',
      as: 'reviewer',
    });
    User.hasMany(models.Reply, {
      foreignKey: 'userId',
      as: 'repliedBy',
    });
    User.hasOne(models.Cart, {
      foreignKey: 'userId',
      as: 'cart',
    });
    User.belongsTo(models.Role, { foreignKey: 'roleId', as: 'role' });
    User.hasMany(models.Chat, { foreignKey: 'senderId', as: 'sender' });
    User.hasMany(models.ProductOrder, {
      foreignKey: 'userId',
      as: 'productOrderUser',
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
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      lastTimePasswordUpdated: this.lastTimePasswordUpdated,
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
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      lastTimePasswordUpdated: DataTypes.DATE,
      verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      roleId: {
        type: DataTypes.UUID,
        allowNull: true,
        defaultValue: DataTypes.UUIDV4,
        references: {
          model: 'Roles',
          key: 'id',
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
