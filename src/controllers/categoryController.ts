import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { CategoryAttributes } from '../database/models/category';
import Database from '../database';
import { sendResponse } from '../utils/response';

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    const Exist = await Database.Category.findOne({
      where: {
        name: {
          [Op.iLike]: name.trim(),
        },
      },
    });
    if (Exist) {
      return sendResponse<null>(
        res,
        400,
        null,
        'Category with this name already exists.'
      );
    }
    const category = Database.Category.build({
      name,
      description,
    });

    await category.save();
    return sendResponse<CategoryAttributes>(
      res,
      201,
      category,
      'Category created successfully!'
    );
  } catch (err: unknown) {
    const errors = err as Error;
    return sendResponse<null>(res, 500, null, errors.message);
  }
};
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Database.Category.findAll();
    return sendResponse<CategoryAttributes[]>(
      res,
      200,
      categories,
      'categories fetched successfully!'
    );
  } catch (err: unknown) {
    const errors = err as Error;
    return sendResponse<null>(res, 500, null, errors.message);
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const Exist = await Database.Category.findOne({
      where: {
        name: {
          [Op.iLike]: name.trim(),
        },
      },
    });

    if (Exist) {
      return sendResponse<null>(
        res,
        400,
        null,
        'Category with this name already exists.'
      );
    }

    const [updated] = await Database.Category.update(
      { name, description },
      {
        where: { id },
        returning: true,
      }
    );

    if (updated) {
      return sendResponse<CategoryAttributes>(
        res,
        200,
        req.body,
        'Category updated successfully!'
      );
    }
    return sendResponse<CategoryAttributes>(
      res,
      400,
      req.body,
      'Category not found!'
    );
  } catch (err: unknown) {
    const errors = err as Error;
    return sendResponse<null>(res, 500, null, errors.message);
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await Database.Category.findByPk(id);
    if (!category) {
      return sendResponse<null>(res, 404, null, 'category not found');
    }

    const productsUsingCategory = await Database.Product.findOne({
      where: { categoryId: id },
    });

    if (productsUsingCategory) {
      return sendResponse<null>(
        res,
        400,
        null,
        'Cannot delete category as it is associated with one or more products.'
      );
    }
    await category.destroy();
    return sendResponse<null>(res, 200, null, 'Category deleted successfully!');
  } catch (err: unknown) {
    const errors = err as Error;
    return sendResponse<null>(res, 500, null, errors.message);
  }
};
