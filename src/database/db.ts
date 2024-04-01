/* eslint-disable @typescript-eslint/no-unused-vars */
import { Sequelize } from 'sequelize';
import getDatabaseConfig from '../config/config';
import Models from './models';


const sequelize = new Sequelize(database, username, password, {
  host:host,
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


  }
});

const Database = { sequelize, ...models };
export default Database;
