import { Request } from 'express';
import { FindOptions, Op, WhereOptions } from 'sequelize';
import Database from '../database';

interface Condition {
  [key: string]: WhereOptions | string | number | boolean;
}

interface ConditionMap {
  [key: string]: (value: string) => Condition | null;
}

const shouldApplyWhereClause = (req: Request): boolean =>
  'name' in req.query ||
  'categoryId' in req.query ||
  'sellerId' in req.query ||
  'priceLessThan' in req.query ||
  'priceGreaterThan' in req.query;

const conditionMap: ConditionMap = {
  name: value => ({ name: { [Op.iLike]: `%${value.trim()}%` } }),
  categoryId: value => ({ categoryId: value }),
  sellerId: value => ({ sellerId: value }),
  priceLessThan: value => ({ price: { [Op.lt]: parseFloat(value) } }),
  priceGreaterThan: value => ({ price: { [Op.gt]: parseFloat(value) } }),
};

const buildConditions = (req: Request): Condition[] =>
  Object.entries(req.query)
    .filter(([key]) => Object.keys(conditionMap).includes(key))
    .map(([key, value]) => conditionMap[key](value as string))
    .filter(condition => condition !== null) as Condition[];

export const buildQuery = (req: Request): FindOptions => {
  const defaultPage = 1;
  const defaultLimit = 50;
  const pageNumber = parseInt(req.query.page as string, 10);
  const page = pageNumber > 0 ? pageNumber : defaultPage;
  const limit = parseInt(req.query.limit as string, 10) || defaultLimit;
  const offset = (page - 1) * limit;

  const query: FindOptions = {
    offset,
    limit,
    include: [
      {
        model: Database.User,
        as: 'seller',
        attributes: ['name', 'phone', 'email'],
      },
      {
        model: Database.Category,
        as: 'category',
        attributes: ['name', 'description'],
      },
    ],
  };

  query.where = {};

  interface User {
    id: string;
    role: string;
  }

  const user = req.user as User;

  if (user && user.role === 'seller') {
    query.where = { sellerId: user.id };
  } else {
    query.where = { status: 'true' };
  }

  if (shouldApplyWhereClause(req)) {
    const conditions = buildConditions(req);
    if (conditions.length > 0) {
      query.where = {
        [Op.and]: [query.where, ...conditions],
      };
    }
  }
  if (typeof req.query.sort === 'string') {
    const [sortField, sortDirection = 'asc'] = req.query.sort.split(':');
    query.order = [[sortField, sortDirection.toUpperCase() as 'ASC' | 'DESC']];
  }

  return query;
};
