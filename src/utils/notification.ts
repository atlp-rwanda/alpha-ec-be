import { Namespace, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { sendEmail } from './email';
import Database from '../database';
import { logger } from './logger';

let socket:
  | Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>
  | undefined;

/**
 *
 * @param {any} notification
 * @param {any} param
 * @returns {void}
 */
export function setUpIo(
  notification: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>
) {
  notification.on('connection', (sock: Socket) => {
    socket = sock;
  });
}

/**
 *
 * @param {any} id
 * @param {any} param1
 * @returns {boolean} return true | false
 */
export async function sendNotification<T extends { message: string }>(
  id: string,
  { message }: T
) {
  if (!socket) return;
  const user = await Database.User.findOne({
    where: {
      id,
    },
  });
  if (!user) return false;
  socket.emit(id, { message, user });
  // TODO: FIX email options
  const mailOptions = {
    to: user.email,
    subject: message,
    template: 'NotificationEvent',
    context: {
      message,
      user,
    },
  };
  logger.info("this notification",sendNotification)
  await sendEmail(mailOptions);
  return true;
}
