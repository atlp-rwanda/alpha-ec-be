import dotenv from 'dotenv';
import app from './app';
import { logger } from './utils';
import { socketSetUp } from './chatSetup';

dotenv.config();

const Port = process.env.PORT || 3000;

const server = app.listen(Port, () => {
  logger.info(`Server Started on port ${Port}...`);
});

socketSetUp(server);
