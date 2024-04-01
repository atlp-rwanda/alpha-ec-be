import { Request, Response } from 'express';
import Database from '../database/db';

export const dummyRequest = async (req: Request, res: Response) => {
  try {
    const result = await Database.Dummy.findAll();
    res.status(200).json(result); 
    console.log(result); 
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' }); 
  }
};

export const addition = (x:number ,y:number) => {
    return x + y
}