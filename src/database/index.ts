import { Sequelize } from 'sequelize';
import getDatabaseConfig from '../config/config';
import Models from './models';
import logger from "../utils/logger";

const { username, database, password, host } = getDatabaseConfig();
const sequelize = new Sequelize(database, username, password, {
  host: host,
  dialect: 'postgres',
});

sequelize
  .authenticate()
  .then(() => {
    logger.info("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
    process.exit(1); // Exit the process on connection error
  });

const models = Models(sequelize);

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

const Database = { sequelize, ...models };
export default Database;
