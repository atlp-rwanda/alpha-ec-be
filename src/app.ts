import express from "express";
import { Sequelize } from "sequelize";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routers";
import * as swaggerDocument from '../swagger.json';
import swaggerUi from 'swagger-ui-express';
dotenv.config();
const app = express();

app.use(cors());
app.use(router);


export default app;

app.use('/swagger',swaggerUi.serve,swaggerUi.setup(swaggerDocument))

export default app;

