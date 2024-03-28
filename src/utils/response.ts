import { Response } from 'express';

const sendResponse = <T>(
  res: Response,
  status: number,
  data: T,
  message: string
): Response => {
  const result = /^20\d$/.test(status.toString()) ? 'Success!' : 'Error!';
  return res.status(status).json({
    status: result,
    data: data,
    message: message,
  });
};

export default sendResponse;
