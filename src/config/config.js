const dotenv = require('dotenv');

dotenv.config();

const getDatabaseConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  const envPrefixMap = {
    development: 'DATABASE',
    test: 'TEST_DATABASE',
    production: 'PROD_DATABASE'
  };

  const prefix = envPrefixMap[env] || 'DATABASE';

  return {
    database: process.env[`${prefix}_NAME`] || '',
    username: process.env[`${prefix}_USER`] || '',
    password: process.env[`${prefix}_PASSWORD`] || '',
    host: process.env[`${prefix}_HOST`] || '',
    port: process.env[`${prefix}_PORT`] || '',
    dialect: process.env.DIALECT || '',
    secret: process.env.JWT_SECRET || 'secret',
  };
};

module.exports = getDatabaseConfig;