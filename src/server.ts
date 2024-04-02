import dotenv from 'dotenv';
import app from './app';
import { logger } from './utils'
dotenv.config();

const Port = process.env.PORT || 3000;
app.listen(Port, () => {
  logger.info(`Server Started on port ${Port}...`);
});
