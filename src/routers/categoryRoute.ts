import { Router } from 'express';
import { isAuthenticated, isSeller, validationMiddleware } from '../middleware';
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from '../controllers/categoryController';
import { categoryValidationSchema } from '../validations/categoryValidation';

const router = Router();

router.post(
  '/categories',
  isAuthenticated,
  isSeller,
  validationMiddleware(categoryValidationSchema),
  createCategory
);

router.get('/categories', isAuthenticated, isSeller, getCategories);

router.delete('/categories/:id', isAuthenticated, isSeller, deleteCategory);

router.put(
  '/categories/:id',
  isAuthenticated,
  isSeller,
  validationMiddleware(categoryValidationSchema),
  updateCategory
);

export default router;
