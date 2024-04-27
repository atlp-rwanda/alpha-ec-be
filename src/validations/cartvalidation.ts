import Joi from 'joi';

export const quantitySchema = Joi.object({
  quantity: Joi.number().min(1).max(100).required(),
  productId: Joi.string().required(),
});
