const dotenv = require("dotenv");
dotenv.config();

const getDatabaseConfig = () => {
  const env = process.env.NODE_ENV || "development";

  switch (env) {
    case "test":
      return {
        database: process.env.TEST_DATABASE_NAME ?? "",
        username: process.env.TEST_DATABASE_USER ?? "",
        password: process.env.TEST_DATABASE_PASSWORD ?? "",
        host: process.env.TEST_DATABASE_HOST ?? "",
        port: process.env.TEST_DATABASE_PORT ?? "",
      };
    case "production":
      return {
        database: process.env.PROD_DATABASE_URL ?? "",
        username: process.env.PROD_DATABASE_USER ?? "",
        password: process.env.PROD_DATABASE_PASSWORD ?? "",
        host: process.env.PROD_DATABASE_HOST ?? "",
        port: process.env.PROD_DATABASE_PORT ?? "",
      };
    default:
      return {
        database: process.env.DATABASE_NAME ?? "",
        username: process.env.DATABASE_USER ?? "",
        password: process.env.DATABASE_PASSWORD ?? "",
        host: process.env.DATABASE_HOST ?? "",
        port: process.env.DATABASE_PORT ?? "",
      };
  }
};

module.exports = getDatabaseConfig;
