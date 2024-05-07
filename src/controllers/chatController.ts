import { Request, Response } from 'express';
import { join } from 'path';
import { sendResponse } from '../utils';
import Database from '../database';

export const chatApplication = (req: Request, res: Response) => {
  const filePath = join(__dirname, '../../public/index.html');
  res.sendFile(filePath);
};

export const MessageSent = async (req: Request, res: Response) => {
  try {
    const messages = await Database.Chat.findAll({
      include: {
        model: Database.User,
        as: 'sender',
        attributes: ['name'],
      },
    });
    return sendResponse(res, 200, messages, 'Messages retrieved successfully');
  } catch (err) {
    return sendResponse<null>(res, 500, null, 'Internal Server Error');
  }
};
