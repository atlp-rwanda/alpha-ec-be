import { Sequelize, Model, DataTypes } from 'sequelize';

export interface logoutAttributes {
  id: string;
  token: string;
  createdAt: Date;
  updatedAt: Date;
}
interface logoutCreationAttributes
  extends Omit<logoutAttributes, 'id' | 'createdAt' | 'updatedAt'> {
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Represents a user in the system.
 */
export class Logout extends Model<logoutAttributes, logoutCreationAttributes> {
  declare id: string;

  declare token: string;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;

  /**
   * Overrides the default toJSON method to exclude the password field.
   * @returns {Object} An object representing the user, excluding the password.
   */
  toJSON() {
    return {
      id: this.id,
      token: this.token,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

const LogoutModel = (sequelize: Sequelize) => {
  Logout.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      token: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Logout',
      tableName: 'logouts',
      timestamps: true,
    }
  );

  return Logout;
};

export default LogoutModel;
