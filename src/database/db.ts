import { Sequelize } from 'sequelize';
import getDatabaseConfig from '../config/config';
import Models from './models';

const { username, database, password ,host } = getDatabaseConfig();

const sequelize = new Sequelize(database, username, password, {
  host:host,
  dialect: 'postgres',
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

const models = Models(sequelize);

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

const Database = { sequelize, ...models };
export default Database;
