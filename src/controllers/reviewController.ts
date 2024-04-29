import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Database from '../database';
import { sendResponse } from '../utils';
import { UserInterface } from './productController';
import { ReviewAttributes } from '../database/models/review';

const getAverage = (reviews: ReviewAttributes[]): number => {
  const totalRatings = reviews.reduce((acc, rev) => acc + rev.rating, 0);

  return totalRatings / reviews.length;
};

export const addAReview = async (req: Request, res: Response) => {
  try {
    const { productId, rating, feedback } = req.body;

    const user = req.user as UserInterface;
    const userId = user.id;

    const reviewedProduct = await Database.Product.findByPk(productId);

    if (!reviewedProduct) {
      return sendResponse<null>(res, 404, null, 'Product does not exist!');
    }

    const review = Database.Review.build({
      userId,
      productId,
      rating,
      feedback,
    });

    await review.save();
    const allReviews = await Database.Review.findAll({
      where: { productId },
      attributes: ['rating'],
    });

    const averageRatings = getAverage(allReviews);

    reviewedProduct.averageRatings = averageRatings;
    reviewedProduct.reviewsCount = allReviews.length;

    await reviewedProduct.save();

    return sendResponse<ReviewAttributes>(
      res,
      201,
      review,
      'Review added successfully!'
    );
  } catch (err: unknown) {
    const errors = err as Error;
    return sendResponse<null>(res, 500, null, errors.message);
  }
};

export const getAllReviews = async (req: Request, res: Response) => {
  try {
    const productId = req.query.productId as string;

    const productExist = await Database.Product.findByPk(productId);

    if (!productExist) {
      return sendResponse<null>(res, 404, null, 'Product does not exist!');
    }

    const allReviews = await Database.Review.findAll({
      where: { productId },
      order: [['createdAt', 'ASC']],
      include: [
        {
          model: Database.User,
          as: 'reviewedBy',
          attributes: ['name', 'email', 'photoUrl'],
        },
        {
          model: Database.Reply,
          as: 'replies',
          limit: 3,
          include: [
            {
              model: Database.User,
              as: 'repliedBy',
              attributes: ['name', 'email', 'photoUrl'],
            },
          ],
        },
      ],
    });

    const reviews = {
      averageRatings: getAverage(allReviews),
      reviewsCount: allReviews.length,
      allReviews,
    };

    return sendResponse(res, 200, reviews, 'Review retrieved successfully!');
  } catch (err: unknown) {
    const errors = err as Error;
    return sendResponse<null>(res, 500, null, errors.message);
  }
};

export const deleteAReview = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    const user = req.user as UserInterface;
    const userId = user.id;

    const review: ReviewAttributes | null = await Database.Review.findOne({
      where: {
        [Op.and]: [{ id: reviewId }, { userId }],
      },
    });

    if (!review) {
      return sendResponse<null>(
        res,
        404,
        null,
        'Review does not exist or not your Review!'
      );
    }
    const { productId } = review;

    await Database.Reply.destroy({
      where: { reviewId },
    });

    await Database.Review.destroy({ where: { id: review.id } });

    const allReviews = await Database.Review.findAll({
      where: { productId },
      attributes: ['rating'],
    });

    const averageRatings = getAverage(allReviews);

    await Database.Product.update(
      {
        averageRatings,
        reviewsCount: allReviews.length,
      },
      { where: { id: productId } }
    );

    return sendResponse<null>(res, 200, null, 'Review deleted successfully!');
  } catch (err: unknown) {
    const errors = err as Error;
    return sendResponse<null>(res, 500, null, errors.message);
  }
};
