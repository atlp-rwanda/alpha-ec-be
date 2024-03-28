'use strict';
import { Sequelize, Model, DataTypes, Optional } from "sequelize";
module.exports = (sequelize:Sequelize, DataTypes:any) => {
  class Register extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models:Model) {
      // define association here
    }
  }
  Register.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.ENUM("admin", "user"),
    email: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Register',
  });
  return Register;
};