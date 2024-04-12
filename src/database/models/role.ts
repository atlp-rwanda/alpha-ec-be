/* eslint-disable require-jsdoc */
import { UUID } from 'crypto';
import { Model, DataTypes, Sequelize } from 'sequelize';

export interface RoleAttributes {
  id: string;
  name: string;
  description: string;
}

interface RoleCreationAttributes extends Omit<RoleAttributes, 'id'> {
  id?: string;
}

export class Role
  extends Model<RoleAttributes, RoleCreationAttributes>
  implements RoleAttributes
{
  public id!: UUID;

  public name!: string;

  public description!: string;

  static associate() {}

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

export default (sequelize: Sequelize) => {
  Role.init(
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
      modelName: 'Role',
      freezeTableName: true,
    }
  );

  return Role;
};
