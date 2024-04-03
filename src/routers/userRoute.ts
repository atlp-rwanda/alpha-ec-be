import { Router } from 'express';
import { createUser } from '../controllers/userController';
import { validationMiddleware } from '../middleware';
import {
  userValidationSchema,
  loginUserSchema,
  resetPasswordSchema,
} from '../validations';
import validatingUser from '../controllers/loginController';
import {
  forgotPassword,
  resetPassword,
} from '../controllers/resetPasswordController';

const router = Router();

router.post(
  '/users/register',
  validationMiddleware(userValidationSchema),
  createUser
);
router.post(
  '/users/login',
  validationMiddleware(loginUserSchema),
  validatingUser
);
router.post('/users/forgot-password', forgotPassword);
router.patch(
  '/users/reset-password/:token',
  validationMiddleware(resetPasswordSchema),
  resetPassword
);

export default router;
