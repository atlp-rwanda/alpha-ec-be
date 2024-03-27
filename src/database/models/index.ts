import { Sequelize } from 'sequelize';
import DummyModel, { Dummy } from './dummy';

export { Dummy };

const Models = (sequelize: Sequelize) => {
  const Dummy = DummyModel(sequelize);

  return {
    Dummy,
  };
};
export default Models;
