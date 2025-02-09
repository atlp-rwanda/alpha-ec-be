import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { IncomingMessage, ServerResponse } from 'http';
import { sendEmail } from './email';
import Database from '../database';

let socket:
  | Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>
  | undefined;

/**
 *
 * @param {any} httpServer
 * @returns {void}
 */
export function setUpIo(
  httpServer: Server<typeof IncomingMessage, typeof ServerResponse>
) {
  // @ts-expect-error no error no error
  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:3001',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', sock => {
    socket = sock;
  });
}

/**
 *
 * @param {any} id
 * @param {any} param1
 * @returns {boolean} return true | false
 */
export async function sendNotification<
  T extends { message: string; event: string; createdAt: Date },
>(id: string, { message, event, createdAt }: T): Promise<boolean> {
  const user = await Database.User.findOne({
    where: {
      id,
    },
  });
  if (!user) return false;
  const mailOptions = {
    to: user.email,
    subject: message,
    template: 'NotificationEvent',
    context: {
      message,
      user,
    },
  };
  if (socket) {
    socket.emit(id, { message, event, createdAt });
  }
  await sendEmail(mailOptions);
  return true;
}
