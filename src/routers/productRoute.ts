import { Router } from 'express';
import {
  handleFileUpload,
  validationMiddleware,
  isAuthenticated,
  isSeller,
} from '../middleware';
import {
  productValidationSchema,
  productUpdateValidationSchema,
} from '../validations';
import {
  createAProduct,
  deleteAProduct,
  getAllProducts,
  getAProduct,
  updateAProduct,
} from '../controllers';

const router = Router();

router.post(
  '/products',
  isAuthenticated,
  isSeller,
  handleFileUpload,
  validationMiddleware(productValidationSchema),
  createAProduct
);

router.get('/products', getAllProducts);

router.get('/products/:id', getAProduct);

router.patch(
  '/products/:id',
  isAuthenticated,
  isSeller,
  handleFileUpload,
  validationMiddleware(productUpdateValidationSchema),
  updateAProduct
);

router.delete('/products/:id', isAuthenticated, isSeller, deleteAProduct);

export default router;
