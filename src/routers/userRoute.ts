import { Router } from 'express';
import { createUser } from '../controllers/userController';
import { validationMiddleware } from '../middleware';
import { userValidationSchema, loginUserSchema } from '../validations';
import validatingUser from '../controllers/loginController';
import verifyOTP from '../controllers/verifyController';

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
router.post('/users/login/verify', verifyOTP);

export default router;
