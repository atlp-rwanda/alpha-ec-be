import Joi from 'joi';
import { Request, Response } from 'express';
import { Momo, Transaction } from '../utils/momo';
import { sendResponse } from '../utils';
import dotenv from 'dotenv';


dotenv.config()


const transactionSchema = Joi.object({
  txRef: Joi.number().min(6).required(),
  amount: Joi.string().min(1).required(),
  account: Joi.string().min(10).max(12).required(),
});

export const createPayment = (req: Request, res: Response) => {
  const momo = new Momo(process.env.MTN_SUBSCRIPTION_KEY || '', 'mtnrwanda');
  const { error, value } = transactionSchema.validate(req.body);
  if (error) {
    sendResponse(res, 500, error, 'payment faied');
    return;
  }

  momo
    .pay(value)
    .then(status => {
      sendResponse(res, 200, status, 'payment succeded');
    })
    .catch(error => {
      sendResponse(res, 500, error, 'Error processing payment:');
    });
};
