import { Request, Response } from 'express';
import Database from '../database/db';

export const dummyRequest = async (req: Request, res: Response) => {
  try {
    const result = await Database.Dummy.findAll();
    res.json(result);
    console.log(result); // eslint-disable-line no-console
  } catch (err) {
    res.status(500).json(err);
  }
};