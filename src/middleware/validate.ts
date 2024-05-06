import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { sendResponse } from '../utils';

// eslint-disable-next-line no-shadow
export enum RequestType {
  Body = 'body',
  Params = 'params',
  Query = 'query',
}

interface errorInterface {
  field: string;
  message: string;
}

export const validationMiddleware =
  (schema: Joi.ObjectSchema, type: RequestType = RequestType.Body) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestDataMap = {
        [RequestType.Body]: req.body,
        [RequestType.Query]: req.query,
        [RequestType.Params]: req.params,
      };

      const dataToValidate = requestDataMap[type];

      const { error } = schema.validate(dataToValidate, { abortEarly: false });

      if (error) {
        const errors: errorInterface[] = [];
        error.details.forEach(err => {
          const field = err.path[0] as string;
          if (field === 'password') {
            errors.push({
              field,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              message: (err as any).context.message,
            });
          } else {
            errors.push({
              field,
              message: err.message,
            });
          }
        });

        return sendResponse<errorInterface[]>(
          res,
          400,
          errors,
          'Validation Errors!'
        );
      }

      next();
    } catch (error: unknown) {
      const errorMessage = (error as Error).message;
      return sendResponse(res, 500, null, errorMessage);
    }
  };
