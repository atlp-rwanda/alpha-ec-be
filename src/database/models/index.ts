import { Sequelize } from 'sequelize';
import DummyModel, { Dummy as DummyModelType } from './dummy';

export { DummyModelType };

const Models = (sequelize: Sequelize) => {
  const Dummy = DummyModel(sequelize);

  return {
    Dummy,
  };
};
export default Models;
