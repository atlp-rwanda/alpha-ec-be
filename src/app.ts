/* eslint-disable import/no-extraneous-dependencies */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import swaggerUi from 'swagger-ui-express';
import router from './routers';
import getDatabaseConfig from './config/config';
import * as swaggerDocument from './swagger.json';

// Import and execute Passport setup
// eslint-disable-next-line import/no-unresolved
import './config/passport-setup';

dotenv.config();
const dbConfig = getDatabaseConfig();
const app = express();

app.use(
  session({
    secret: dbConfig.secret,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(cors());
app.use(express.json());
app.use(router);

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
export default app;
