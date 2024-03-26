import DummyModel, { Dummy } from "./dummy";
import { Sequelize } from "sequelize";
export { Dummy };

const Models = (sequelize: Sequelize) => {
  const Dummy = DummyModel(sequelize);

  return {
    Dummy,
  };
};
export default Models;
