import express from 'express';
import { Sequelize } from 'sequelize';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routers';

dotenv.config();
const app = express();

app.use(cors());
app.use(router);

export default app;
