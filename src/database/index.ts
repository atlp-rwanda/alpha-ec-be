import { Sequelize } from 'sequelize';
import getDatabaseConfig from '../config/config';
import Models from './models';
import { logger } from '../utils';

interface DatabaseConfigInterface {
  database: string;
  username: string;
  password: string;
  host: string;
  port: string;
  dialect: string;
  secret: string;
  dialectOptions?: {
     ssl: {
       require: boolean;
       rejectUnauthorized: boolean;
     };
  };
 }
 

const { username, database, password, host, dialectOptions} = getDatabaseConfig() as DatabaseConfigInterface;
const sequelize = new Sequelize(database, username, password, {
  host: host,
  dialect: 'postgres',
  logging: false,
  ...(dialectOptions ? { dialectOptions } : {}),
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