import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import Database from './database';
import { decodeToken, findUsername } from './utils/tokenGenerate';
import { logger } from './utils';
import { setUpIo } from './utils/notification';

interface CustomSocket extends Socket {
  userId?: string;
}
let chat: any;
let notification:any;
export const findId = (socket: CustomSocket) => {
  const { token } = socket.handshake.auth;
  const id = decodeToken(token);
  socket.emit('sendUserId', id);
  socket.userId = id;
  return id;
};

interface ChatMessage {
  socketId: string;
  content: string;
  messageDate: string;
}
const handleSentMessage = async (
  socket: CustomSocket,
  data: ChatMessage,
  io: Server
) => {
  const senderId = socket.userId!;
  const readStatus = false;
  if (senderId) {
    const { content } = data;
    const { socketId } = data;
    const { messageDate } = data;
    const senderName = await findUsername(socket.userId!);
    Database.Chat.create({
      socketId,
      senderId,
      content,
      readStatus,
    });

    // eslint-disable-next-line no-shadow
    io.emit('receiveMessage', {
      socketId,
      messageDate,
      senderName,
      senderId,
      content,
      readStatus,
    });
  }
};

const handleTyping = async (socket: CustomSocket, isTyping: string) => {
  socket.broadcast.emit('typing', isTyping);
};

const handleDisconnect = () => {
  logger.info('user disconnected');
};
export const socketSetUp = (server: HttpServer) => {
  const io = new Server(server);
  notification = io.of('/notification');
  setUpIo(notification);
  chat = io.of('/chats');
  chat.use(async (socket: CustomSocket, next: () => void) => {
    const id = findId(socket);
    socket.userId = id;
    logger.info('user connected successul', socket.userId);
    next();
  });

  chat.on('connection', async (socket: CustomSocket) => {
    chat.emit('welcome', 'welcome to our chat application');
    socket.on('sentMessage', data => handleSentMessage(socket, data, chat));
    socket.on('typing', isTyping => handleTyping(socket, isTyping));
    socket.on('disconnect', () => handleDisconnect);
    
    // io.on('connection', sock => {
    //   if (socket.id === sock.id) {
    //     socket = sock;
    //   }
    // });
});

}