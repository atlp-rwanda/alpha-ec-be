import dotenv from 'dotenv';
import { Request, Response } from 'express';
import AWS from 'aws-sdk';
import { _Blob } from 'aws-sdk/clients/lambda';
import { sendResponse } from '../utils';
import { CategoryAttributes } from '../database/models/category';
import { excOperation } from '../helper';

dotenv.config();

AWS.config.update({
  region: 'eu-north-1',
  credentials: new AWS.SharedIniFileCredentials({ profile: 'default' }),
});

const lambda = new AWS.Lambda();

export const getAds = async (req: Request, res: Response) => {
  try {
    const { name, categoryId, page } = req.query;

    let category: CategoryAttributes | null = null;

    if (categoryId) {
      const query = {
        where: { id: categoryId },
      };

      category = await excOperation<CategoryAttributes | null>(
        'Category',
        'findOne',
        query
      );
    }

    const keyWord = `${name} ${category?.name || ''}` || 'items';
    const neededPage = page || '1';

    const params = {
      FunctionName: 'GetAliExpressAds',
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({ keyWord, neededPage }),
    };

    const lambdaResponse = await lambda.invoke(params).promise();
    const Ads = await JSON.parse(lambdaResponse.Payload as string);

    return sendResponse<_Blob | undefined>(
      res,
      200,
      Ads,
      'Ads retrived successfully!'
    );
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).json({ status: 500, success: false, message: err.message });
  }
};
