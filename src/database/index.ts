/* eslint-disable @typescript-eslint/no-unused-vars */
import { Sequelize } from 'sequelize';
import getDatabaseConfig from '../config/config';
import Models from './models';
import { logger } from '../utils';

const { username, database, password, host } = getDatabaseConfig();
const sequelize = new Sequelize(database, username, password, {
  dialect: 'postgres',
  host
});

sequelize
  .authenticate()
  .then(() => {
    logger.info('Connection has been established successfully.');
  })
  .catch((err: Error) => {
    logger.error('Unable to connect to the database:', err);
  });
const models = Models(sequelize);

Object.keys(models).forEach(key => {
  // @ts-expect-error ignore expected errors
  if (models[key].associate) {
    // @ts-expect-error ignore expected errors
    models[key].associate(models);
  }
});

const Database = { sequelize, ...models };
export default Database;