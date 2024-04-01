import { NextFunction, Request, Response } from 'express';
import { logger, sendResponse } from '../utils';
import Joi from 'joi';

enum requestType {
  body='body',
  params='params',
  queries='queries'
}

interface errorInterface {
  field: string,
  message: string
}

export const validationMiddleware = (schema: Joi.ObjectSchema, type: requestType = requestType.body)=>(
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {
    const { error } = schema.validate(req.body, { abortEarly: false })

    if(error){
      
      const errors: errorInterface[] = [];
      error.details.forEach((err)=>{
        const field = err.path[0] as string;
        if(field == 'password'){
          errors.push({
            field,
            message: (err as any).context.message
          })
        }else{
          errors.push({
            field,
            message: err.message
          })
        }
      });
      
      return sendResponse<errorInterface[]>(res, 400, errors, "Validation Errors!")
    }

    next();
    
  } catch (error: unknown) {
    const errorMessage = (error as Error).message
    return sendResponse(res, 500, null, errorMessage);
  }
};
