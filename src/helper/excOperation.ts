import { FindOptions } from 'sequelize';
import Database from '../database';

type SequelizeOperation =
  | 'findAll'
  | 'findOne'
  | 'destroy'
  | 'update'
  | 'increment'
  | 'decrement'
  | 'count'
  | 'findAndCountAll';

type Models = 'User' | 'Product' | 'Category';

export const excOperation = async <T>(
  modelName: Models,
  operation: SequelizeOperation,
  queryObject: FindOptions
): Promise<T> => {
  if (!Database[modelName] || !Database[modelName][operation]) {
    throw new Error(
      `Invalid modelName or operation: ${modelName}.${operation}`
    );
  }

  const result = await (
    Database[modelName][operation] as (query: FindOptions) => Promise<T>
  )(queryObject);
  return result as T;
};
