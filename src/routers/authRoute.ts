import { Router } from 'express';
import * as authController from '../controllers/authController';

const router = Router();

router.get('/users/google-auth', authController.initiateGoogleLogin);
router.get('/users/google-auth/callback', authController.handleGoogleCallback);

export default router;
