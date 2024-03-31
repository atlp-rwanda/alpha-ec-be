/* eslint-disable @typescript-eslint/no-unused-vars */
import { Sequelize } from 'sequelize';
import getDatabaseConfig from '../config/config';
import Models from './models';

const { username, database, password } = getDatabaseConfig();
const sequelize = new Sequelize(database, username, password, {
  dialect: 'postgres',
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.'); // eslint-disable-line no-console
  })
  .catch((err: Error) => {
    console.error('Unable to connect to the database:', err); // eslint-disable-line no-console
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
