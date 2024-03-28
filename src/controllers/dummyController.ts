import Database from "../database/db";
import { Request, Response } from "express";

const dummyRequest = async (req: Request, res: Response) => {
  try {
    const result = await Database.Dummy.findAll();
    res.json(result);
    console.log(result);
  } catch (err) {
    res.status(500).json(err);
  }
};
export function addition (a: number, b: number): number {
  return a + b;
}
export default dummyRequest;

