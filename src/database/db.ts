/* eslint-disable @typescript-eslint/no-unused-vars */
import { Sequelize } from 'sequelize';
import getDatabaseConfig from '../config/config';
import Models from './models';
import logger from "../utils/logger";

const { username, database, password } = getDatabaseConfig();
const sequelize = new Sequelize(database, username, password, {
  dialect: 'postgres',
  logging: false,
});

sequelize
  .authenticate()
  .then(() => {
    logger.info('Connection has been established successfully.'); // eslint-disable-line no-console
  })
  .catch((err: Error) => {
    logger.error('Unable to connect to the database:', err); // eslint-disable-line no-console
  });
const models = Models(sequelize);

Object.keys(models).forEach(key => {
  if (models[key].associate) {
    models[key].associate(models);
  }
});

const Database = { sequelize, ...models };
export default Database;
