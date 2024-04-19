// import { Socket, Server } from 'socket.io';
// import res from './server';
// import Database from './database';
// import { logger } from './utils';
// import { decodeToken } from './utils/tokenGenerate';

// const io = new Server(res);

// interface CustomSocket extends Socket {
//   userId?: string;
// }
// const findId = (socket: CustomSocket) => {
//   const { token } = socket.handshake.auth;
//   const id = decodeToken(token);
//   socket.userId = id;
//   return id;
// };

// io.use(async (socket: CustomSocket, next) => {
//   const id = findId(socket);
//   socket.userId = id;
//   next();
// });

// io.on('connection', (socket: CustomSocket) => {
//   logger.info('user connected');
//   io.emit('welcome', 'welcome to our chat application');
//   socket.on('disconnect', () => {
//     logger.info('user disconnected');
//   });
//   // eslint-disable-next-line no-shadow
//   socket.on('sentMessage', data => {
//     const senderId = socket.userId;
//     if (senderId) {
//       const { content } = data;
//       Database.Chat.create({ senderId, content });
//       io.emit('receiveMessage', data);
//     }
//   });
// });
