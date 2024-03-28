import UserModel, { User } from "./user";
import { Sequelize } from "sequelize";
export { User };

const Models = (sequelize: Sequelize) => {
  const User = UserModel(sequelize);

  return {
    User,
  };
};
export default Models;
