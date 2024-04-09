import { FindOptions, Op } from 'sequelize';
import { Request } from 'express';
import Database from '../database';

const shouldApplyWhereClause = (req: Request): boolean =>
  'name' in req.query ||
  'category' in req.query ||
  'sellerId' in req.query ||
  'priceLessThan' in req.query ||
  'priceGreaterThan' in req.query;

export const buildQuery = (req: Request): FindOptions => {
  const defaultPage = 1;
  const defaultLimit = 50;

  const pageNumber = parseInt(req.query.page as string, 10);
  const page = pageNumber > 0 ? pageNumber : 1 || defaultPage;
  const limit = parseInt(req.query.limit as string, 10) || defaultLimit;

  const offset = (page - 1) * limit;

  const query: FindOptions = {
    offset,
    limit,
    include: [
      {
        model: Database.User,
        as: 'seller',
        attributes: ['id', 'name', 'phone', 'email'],
      },
    ],
  };

  if (shouldApplyWhereClause(req)) {
    query.where = {};
    const conditions: Array<{
      name?: { [Op.iLike]: string };
      category?: { [Op.iLike]: string };
      sellerId?: string;
      price?: { [Op.lt]?: number; [Op.gt]?: number };
    }> = [];

    if (
      'name' in req.query &&
      typeof req.query.name === 'string' &&
      req.query.name.trim() !== ''
    ) {
      const searchTerm = `%${req.query.name.trim()}%`;
      conditions.push({ name: { [Op.iLike]: searchTerm } });
    }

    if (
      'category' in req.query &&
      typeof req.query.category === 'string' &&
      req.query.category.trim() !== ''
    ) {
      const searchTerm = `%${req.query.category.trim()}%`;
      conditions.push({ category: { [Op.iLike]: searchTerm } });
    }

    if ('sellerId' in req.query && typeof req.query.sellerId === 'string') {
      conditions.push({ sellerId: req.query.sellerId });
    }

    if (
      'priceLessThan' in req.query &&
      typeof req.query.priceLessThan === 'string'
    ) {
      conditions.push({
        price: { [Op.lt]: parseFloat(req.query.priceLessThan) },
      });
    }

    if (
      'priceGreaterThan' in req.query &&
      typeof req.query.priceGreaterThan === 'string'
    ) {
      conditions.push({
        price: { [Op.gt]: parseFloat(req.query.priceGreaterThan) },
      });
    }

    if (conditions.length > 0) {
      query.where = { [Op.and]: conditions };
    }

    if (typeof req.query.sort === 'string') {
      const sortParts = req.query.sort.split(':');
      const sortField = sortParts[0];
      const sortDirection = sortParts[1] === 'desc' ? 'DESC' : 'ASC';
      query.order = [[sortField, sortDirection]];
    }
  }

  return query;
};
