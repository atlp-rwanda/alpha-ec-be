/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router } from 'express';
import { isAuthenticated, validationMiddleware } from '../middleware';
import {
  addAReview,
  deleteAReview,
  getAllReviews,
} from '../controllers/reviewController';
import {
  replySchema,
  reviewValidationSchema,
} from '../validations/reviewValidation';
import {
  addAReply,
  deleteAReply,
  getAllReplies,
} from '../controllers/replyController';

const router = Router();

router.post(
  '/reviews',
  isAuthenticated,
  validationMiddleware(reviewValidationSchema),
  addAReview
);

router.get('/reviews', getAllReviews);

router.post(
  '/reviews/:reviewId/replies',
  isAuthenticated,
  validationMiddleware(replySchema),
  addAReply
);

router.get('/reviews/:reviewId/replies', getAllReplies);

router.delete('/reviews/:reviewId', isAuthenticated, deleteAReview);

router.delete(
  '/reviews/:reviewId/replies/:replyId',
  isAuthenticated,
  deleteAReply
);

export default router;
