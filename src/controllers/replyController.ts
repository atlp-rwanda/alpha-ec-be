import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Database from '../database';
import { sendResponse } from '../utils';
import { UserInterface } from './productController';
import { ReplyAttributes } from '../database/models/reply';

export const addAReply = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    const { feedback } = req.body;

    const user = req.user as UserInterface;
    const userId = user.id;

    const repliedReview = await Database.Review.findOne({
      where: { id: reviewId },
    });

    if (!repliedReview) {
      return sendResponse<null>(res, 404, null, 'Review does not exist!');
    }

    const reply = Database.Reply.build({
      userId,
      reviewId,
      feedback,
    });

    await reply.save();

    const repliesCount = await Database.Reply.count({
      where: { reviewId },
    });

    repliedReview.repliesCount = repliesCount;

    await repliedReview.save();

    return sendResponse<ReplyAttributes>(
      res,
      201,
      reply,
      'Reply added successfully!'
    );
  } catch (err: unknown) {
    const errors = err as Error;
    return sendResponse<null>(res, 500, null, errors.message);
  }
};

export const getAllReplies = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;

    const reviewExist = await Database.Review.findByPk(reviewId);

    if (!reviewExist) {
      return sendResponse<null>(res, 404, null, 'Review does not exist!');
    }

    const allReplies = await Database.Reply.findAll({
      where: { reviewId },
      include: [
        {
          model: Database.User,
          as: 'repliedBy',
          attributes: ['name', 'email', 'photoUrl'],
        },
      ],
      order: [['createdAt', 'ASC']],
    });

    return sendResponse<ReplyAttributes[]>(
      res,
      200,
      allReplies,
      'Review retrieved successfully!'
    );
  } catch (err: unknown) {
    const errors = err as Error;
    return sendResponse<null>(res, 500, null, errors.message);
  }
};

export const deleteAReply = async (req: Request, res: Response) => {
  try {
    const { replyId } = req.params;
    const user = req.user as UserInterface;
    const userId = user.id;

    const reply: ReplyAttributes | null = await Database.Reply.findOne({
      where: {
        [Op.and]: [{ id: replyId }, { userId }],
      },
    });

    if (!reply) {
      return sendResponse<null>(
        res,
        404,
        null,
        'Reply does not exist or not your Reply!'
      );
    }

    const { reviewId } = reply;

    await Database.Reply.destroy({
      where: {
        [Op.and]: [{ id: replyId }, { userId }],
      },
    });
    const repliesCount = await Database.Reply.count({
      where: { reviewId },
    });

    await Database.Review.update(
      {
        repliesCount,
      },
      {
        where: { id: reviewId },
      }
    );

    return sendResponse<null>(res, 200, null, 'Reply deleted successfully!');
  } catch (err: unknown) {
    const errors = err as Error;
    return sendResponse<null>(res, 500, null, errors.message);
  }
};
