import { Request, Response } from 'express';
import Database from '../database/db';


export function addition(a: number, b: number): number {
  return a + b;
}


