import { Dialect, Sequelize } from "sequelize";
import getDatabaseConfig from "../config/config";
import Models from "./models";

const { username, database, password } = getDatabaseConfig();
const sequelize = new Sequelize(database, username, password, {
  dialect: "postgres",
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
const models = Models(sequelize);

Object.keys(models).forEach((key) => {
  // @ts-ignore
  if (models[key].associate) {
    // @ts-ignore
    models[key].associate(models);
  }
});

const Database = { sequelize, ...models };
export default Database;
