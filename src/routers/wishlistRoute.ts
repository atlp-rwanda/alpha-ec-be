import { Router } from 'express';
import {
  addToWishlist,
  getWishlist,
  clearWishlist,
} from '../controllers/wishlistController';
import { isAuthenticated, isBuyer } from '../middleware';

const router = Router();
router.post('/wishes', isAuthenticated, isBuyer, addToWishlist);
router.get('/wishes', isAuthenticated, getWishlist);
router.delete('/wishes', isAuthenticated, isBuyer, clearWishlist);
export default router;
