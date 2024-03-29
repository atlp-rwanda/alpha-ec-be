import { Sequelize, Model, DataTypes, Optional } from 'sequelize';
// Define User model interface
interface UserAttributes {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}
// eslint-disable-next-line require-jsdoc
export class Dummy extends Model<UserAttributes, UserCreationAttributes> {
  declare id: string;

  declare name: string;

  declare email: string;

  declare createdAt: Date;

  declare updatedAt: Date;

  // eslint-disable-next-line require-jsdoc, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  public static associate(model: any) {}

  // eslint-disable-next-line require-jsdoc
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

const DummyModel = (sequelize: Sequelize) => {
  Dummy.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Dummy',
      timestamps: true,
    }
  );

  return Dummy;
};

export default DummyModel;
