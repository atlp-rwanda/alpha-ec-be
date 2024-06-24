/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { Request, Response } from 'express';
import path from 'path';
import { getUser, updateUser } from '../controllers/update-profileController';
import {
  createUser,
  getAllSellers,
  getAllUsers,
} from '../controllers/userController';
import { isAdmin, isAuthenticated, validationMiddleware } from '../middleware';
import { chatApplication, MessageSent } from '../controllers/chatController';
import {
  userValidationSchema,
  loginUserSchema,
  personalValidationalSchema,
  resetPasswordSchema,
  emailValidation,
} from '../validations';
import loginController from '../controllers/loginController';
import updatePassword from '../controllers/changePasswordController';
import changePasswordValidationSchema from '../validations/newPasswordValidation';
import logoutUser from '../controllers/logoutController';

import { singleFileUpload } from '../middleware/fileUpload';
import { verifyEmail } from '../controllers/userVerifyController';
import {
  forgotPassword,
  resetPassword,
} from '../controllers/resetPasswordController';
import { userStatus } from '../controllers/userStatusController';
import { isvalid } from '../middleware/otpauthMiddleware';
import { sellerOtp, verifyOtp } from '../controllers/OTPcontroller';

const router = express.Router();

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
router.post('/users/logout', isAuthenticated, logoutUser);
router.get('/users', isAuthenticated, isAdmin, getAllUsers);
router.get('/users/profile', isAuthenticated, getUser);
router.patch(
  '/users/profile',
  isAuthenticated,
  singleFileUpload,
  validationMiddleware(personalValidationalSchema),
  updateUser
);
router.post('/users/verify/:token', isvalid, sellerOtp);
router.get('/users/verify-otp/:token', verifyOtp);

router.get('/users/verify-email/:token', verifyEmail);
router.post('/users/:id/account-status', isAuthenticated, isAdmin, userStatus);
router.get('/chatapp', chatApplication);
router.get('/chats', isAuthenticated, MessageSent);

router.post(
  '/users/forgot-password',
  validationMiddleware(emailValidation),
  forgotPassword
);
router.patch(
  '/users/reset-password/:token',
  validationMiddleware(resetPasswordSchema),
  resetPassword
);
router.get('/users/sellers', getAllSellers);
export default router;
