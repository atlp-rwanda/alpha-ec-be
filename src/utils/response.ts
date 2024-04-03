import { Response } from 'express';

export const sendResponse = <T>(
  res: Response,
  status: number,
  data: T,
  message: string
): Response => {
  const result = /^20\d$/.test(status.toString()) ? 'Success!' : 'Error!';
  return res.status(status).json({
    status: result,
    data,
    message,
  });
};
