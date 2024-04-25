import Joi from 'joi';

export const reviewValidationSchema = Joi.object({
  productId: Joi.string().required(),
  rating: Joi.number().min(0).max(5).required(),
  feedback: Joi.string().min(3).max(300).optional(),
});

export const replySchema = Joi.object({
  feedback: Joi.string().required(),
});
