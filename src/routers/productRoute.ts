import { Router } from 'express';
import {
  handleFileUpload,
  validationMiddleware,
  isAuthenticated,
  isSeller,
  RequestType,
} from '../middleware';
import {
  productValidationSchema,
  productUpdateValidationSchema,
  adsValidationSchema,
} from '../validations';
import {
  createAProduct,
  deleteAProduct,
  getAllProducts,
  getAProduct,
  updateAProduct,
  updateProductAvailability,
} from '../controllers';
import { getAds } from '../controllers/adsController';

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
// router.get('/products/:productId/relation', getRelatedProducts);
router.patch(
  '/products/:id/status',
  isAuthenticated,
  isSeller,
  updateProductAvailability
);
router.patch(
  '/products/:id',
  isAuthenticated,
  isSeller,
  handleFileUpload,
  validationMiddleware(productUpdateValidationSchema),
  updateAProduct
);

router.delete('/products/:id', isAuthenticated, isSeller, deleteAProduct);

router.get(
  '/ads',
  validationMiddleware(adsValidationSchema, RequestType.Query),
  getAds
);

export default router;
