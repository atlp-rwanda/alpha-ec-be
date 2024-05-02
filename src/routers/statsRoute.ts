import express from 'express';
import { getProductStats } from '../controllers/statsController';
import { isAuthenticated, isSeller } from '../middleware';

const router = express.Router();

router.get('/stats', isAuthenticated, isSeller, getProductStats);

export default router;
