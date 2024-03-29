import express from "express";

import cors from "cors";
import dotenv from "dotenv";
import router from "./routers";
import * as swaggerDocument from '../swagger.json';
import swaggerUi from 'swagger-ui-express';
dotenv.config();
const app = express();

app.use(cors());
app.use(router);

app.use('/swagger',swaggerUi.serve,swaggerUi.setup(swaggerDocument))

export default app;
