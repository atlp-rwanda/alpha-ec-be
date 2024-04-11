/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from 'express';
import { createUser } from '../controllers/userController';
import { isAuthenticated, validationMiddleware } from '../middleware';
import { userValidationSchema, loginUserSchema } from '../validations';
import loginController from '../controllers/loginController';
import updatePassword from '../controllers/changePasswordController';
import changePasswordValidationSchema from '../validations/newPasswordValidation';

const router = Router();

router.post(
  '/users/register',
  validationMiddleware(userValidationSchema),
  createUser
);
router.post(
  '/users/login',
  validationMiddleware(loginUserSchema),
  loginController
);
router.post(
  '/users/change-password',
  isAuthenticated,
  validationMiddleware(changePasswordValidationSchema),
  updatePassword
);

export default router;
