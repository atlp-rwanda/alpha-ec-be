import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import router from './routers';
import * as swaggerDocument from './swagger.json';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(router);

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;
