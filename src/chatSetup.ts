import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import dotenv from 'dotenv';
import { sendEmail } from './utils/email';
import Database from './database';
import { decodeToken, findUsername } from './utils/tokenGenerate';
import { logger } from './utils';

dotenv.config();

interface CustomSocket extends Socket {
  userId?: string;
}
let notificationSocket:
  | Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>
  | undefined;
const findId = (socket: CustomSocket) => {
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
  name: string | null;
}
const handleSentMessage = async (
  socket: CustomSocket,
  data: ChatMessage,
  io: Server
) => {
  const senderId = socket.userId!;
  const readStatus = false;
  if (senderId) {
    const { content, socketId, messageDate } = data;
    const senderName = await findUsername(socket.userId!);
    await Database.Chat.create({ socketId, senderId, content, readStatus });
    io.emit('receiveMessage', {
      socketId,
      messageDate,
      name: senderName,
      senderId,
      content,
      readStatus,
    });
  }
};
const handleTyping = (
  socket: CustomSocket,
  isTyping: string,
  name: string | null
) => {
  socket.broadcast.emit('typing', isTyping, name);
};
const handleDisconnect = () => {
  logger.info('user disconnected');
};
const handleNotificationConnection = (
  sock: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>
) => {
  notificationSocket = sock;
};
export const initializeSocketIo = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: `${process.env.FRONTEND_DOMAIN}`,
      methods: ['GET', 'POST'],
    },
  });
  io.use(async (socket: CustomSocket, next) => {
    const id = findId(socket);
    socket.userId = id;
    next();
  });
  io.on('connection', (socket: CustomSocket) => {
    io.emit('welcome', 'welcome to our chat application');
    socket.on('sentMessage', data => handleSentMessage(socket, data, io));
    socket.on('typing', (isTyping, name) =>
      handleTyping(socket, isTyping, name)
    );
    socket.on('disconnect', handleDisconnect);
    handleNotificationConnection(socket);
  });
};
export const sendNotification = async <T extends { message: string }>(
  id: string,
  { message }: T
): Promise<boolean> => {
  if (!notificationSocket) return false;
  const user = await Database.User.findOne({ where: { id } });
  if (!user) return false;
  notificationSocket.emit(id, { message, user });
  const mailOptions = {
    to: user.email,
    subject: message,
    template: 'NotificationEvent',
    context: { message, user },
  };
  await sendEmail(mailOptions);
  return true;
};
