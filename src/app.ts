import express from "express";

import cors from "cors";
import dotenv from "dotenv";
import router from "./routers";
<<<<<<< HEAD
import * as swaggerDocument from '../swagger.json';
import swaggerUi from 'swagger-ui-express';
=======
import loginRouter from './controllers/loginController'
>>>>>>> cf676ae (user login)
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(router);
<<<<<<< HEAD

app.use('/swagger',swaggerUi.serve,swaggerUi.setup(swaggerDocument))

=======
app.use(express.json())
app.use('/api/user/', loginRouter)
>>>>>>> cf676ae (user login)
export default app;
