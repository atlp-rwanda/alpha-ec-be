import { Response } from 'express';
import { pagination } from './pagination';

export const sendResponse = <T>(
  res: Response,
  status: number,
  data: T,
  message: string,
  paginate: boolean = false,
  limit: number = 50,
  page: number = 1,
  name: string = 'data'
): Response => {
  const result = /^20\d$/.test(status.toString()) ? 'Success!' : 'Error!';

  const resData = paginate ? pagination(data, page, limit, name) : data;
  return res.status(status).json({
    status: result,
    data: resData,
    message,
  });
};
