import { Router } from 'express';
import { isAuthenticated } from '../middleware';
import {
    createPayment
} from '../controllers/momoPaymentController';

const router = Router();

router.post(
    '/payments',
    isAuthenticated,
    createPayment
);

export default router;
