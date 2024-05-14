import { createServer } from 'http';
import dotenv from 'dotenv';
import app from './app';
import { logger } from './utils';
import { socketSetUp } from './chatSetup';
import { scheduleProductExpiryCron } from './expiryCronJob';
import { setUpIo } from './utils/notification';

dotenv.config();

const Port = process.env.PORT || 3000;

export const httpServer = createServer(app);
const server = httpServer.listen(Port, () => {
  // @ts-expect-error no error
  setUpIo(httpServer);
  logger.info(`Server Started on port ${Port}...`);
}); // ...

socketSetUp(server);

scheduleProductExpiryCron();
