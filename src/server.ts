import dotenv from 'dotenv';
import app from './app';
import { logger } from './utils';
import { scheduleProductExpiryCron } from './expiryCronJob';
import { socketSetUp } from './chatSetup';

dotenv.config();

const Port = process.env.PORT || 3000;

app.listen(Port, () => {

const server = app.listen(Port, () => {
  logger.info(`Server Started on port ${Port}...`);
});

scheduleProductExpiryCron();

socketSetUp(server);
