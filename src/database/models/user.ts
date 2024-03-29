import { Sequelize, Model, DataTypes } from 'sequelize';

export interface UserAttributes {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
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

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;

  // public static associate(model: any) {}
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
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
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
