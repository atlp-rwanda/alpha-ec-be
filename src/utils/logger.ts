import { createLogger, format, transports } from 'winston';
import path from 'path';
import fs from 'fs';

const logDirectory = 'logs'; 

if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

export const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.prettyPrint(),
    format.json()
  ),
  defaultMeta: { service: 'alpha-ec-be' },
  transports: [
    new transports.File({ filename: path.join(logDirectory, 'error.log'), level: 'error' }),
    new transports.File({ filename: path.join(logDirectory, 'combined.log') }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    })
  );
}
