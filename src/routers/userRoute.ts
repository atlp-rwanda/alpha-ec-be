import { Router } from 'express';
import { createUser } from '../controllers/userController';
import { validationMiddleware } from '../middleware';
import { userValidationSchema, loginUserSchema } from '../validations';
import validatingUser from '../controllers/loginController';

const router = Router();

router.post(
  '/users/register',
  // isAuthenticated,
  // isSeller,
  validationMiddleware(userValidationSchema),
  createUser
);
router.post(
  '/users/login',
  validationMiddleware(loginUserSchema),
  validatingUser
);

export default router;
