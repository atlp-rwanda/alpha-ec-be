import Joi from 'joi';

export const ordervalidation = Joi.object({
  status: Joi.string().valid('pending', 'accepted', 'rejected'),
});
