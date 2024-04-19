import { Request, Response } from 'express';
import { join } from 'path';
import { logger, sendResponse } from '../utils';
import Database from '../database';

export const chatApplication = async (req: Request, res: Response) => {
  try {
    const filePath = join(__dirname, '../../public/index.html');
    res.sendFile(filePath);
  } catch (error) {
    logger.error('Error sending file:', error);
    res.status(500).send('Internal Server Error');
  }
};

export const MessageSent = async (req: Request, res: Response) => {
  try {
    const messages = await Database.Chat.findAll();
    return res.json(messages);
  } catch (err) {
    return sendResponse<null>(res, 400, null, 'no message');
  }
};
