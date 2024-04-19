/* eslint-disable prefer-destructuring */
import dotenv from 'dotenv';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Socket, Server } from 'socket.io';
import app from './app';
import { logger } from './utils';
import Database from './database';
import { decodeToken } from './utils/tokenGenerate';

dotenv.config();

const Port = process.env.PORT || 3000;
const server = app.listen(Port, () => {
  logger.info(`Server Started on port ${Port}...`);
});

interface CustomSocket extends Socket {
  userId?: string;
}

const io = new Server(server);
const findId = (socket: CustomSocket) => {
  const token = socket.handshake.auth.token;
  const id = decodeToken(token);
  socket.userId = id;
  return id;
};

io.use(async (socket: CustomSocket, next) => {
  const id = findId(socket);
  socket.userId = id;
  next();
});

io.on('connection', (socket: CustomSocket) => {
  logger.info('user connected');
  io.emit('welcome', 'welcome to our chat application');
  // understandable
  socket.on('disconnect', () => {
    logger.info('user disconnected');
  });
  // eslint-disable-next-line no-shadow
  socket.on('sentMessage', data => {
    const senderId = socket.userId;
    if (senderId) {
      const content = data.content;
      Database.Chat.create({ senderId, content });
      io.emit('receiveMessage', data);
    }
  });
});
