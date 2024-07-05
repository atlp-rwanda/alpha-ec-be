import { createServer } from 'http';
import dotenv from 'dotenv';
import app from './app';
import { logger } from './utils';
import { scheduleProductExpiryCron } from './expiryCronJob';
import { initializeSocketIo } from './chatSetup';

dotenv.config();

const Port = process.env.PORT || 3000;
export const httpServer = createServer(app);
httpServer.listen(Port, () => {
  logger.info(`Server Started on port ${Port}...`);
});
initializeSocketIo(httpServer);
scheduleProductExpiryCron();
