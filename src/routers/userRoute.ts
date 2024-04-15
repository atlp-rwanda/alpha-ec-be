/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from 'express';
import { getUser, updateUser } from '../controllers/update-profileController';
import { createUser } from '../controllers/userController';
import { isAuthenticated, validationMiddleware } from '../middleware';
import {
  userValidationSchema,
  loginUserSchema,
  personalValidationalSchema,
} from '../validations';
import loginController from '../controllers/loginController';
import updatePassword from '../controllers/changePasswordController';
import changePasswordValidationSchema from '../validations/newPasswordValidation';

import { singleFileUpload } from '../middleware/fileUpload';
import { verifyEmail } from '../controllers/userVerifyController';

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
router.get('/users/profile', isAuthenticated, getUser);
router.patch(
  '/users/profile',
  isAuthenticated,
  singleFileUpload,
  validationMiddleware(personalValidationalSchema),
  updateUser
);

router.get('/users/verify-email/:token', verifyEmail);

export default router;
