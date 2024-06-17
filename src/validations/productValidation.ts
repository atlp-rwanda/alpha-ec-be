/* eslint-disable prettier/prettier */
import Joi from 'joi';

export const productValidationSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  images: Joi.array().items(Joi.any()).min(4).max(8).required(),
  categoryId: Joi.string().required(),
  price: Joi.number().required(),
  expiryDate: Joi.date().greater('now'),
  bonus: Joi.number(),
  status: Joi.string(),
  quantity: Joi.number().min(0).max(1000),
  description: Joi.string().min(5).max(1000).optional(),
});

export const productUpdateValidationSchema = Joi.object({
  name: Joi.string().min(3).max(30).optional(),
  images: Joi.array().items(Joi.any()).min(4).max(8).optional(),
  categoryId: Joi.string().optional(),
  price: Joi.number().optional(),
  expiryDate: Joi.date().optional(),
  bonus: Joi.number().optional(),
  status: Joi.string().optional(),
  quantity: Joi.number().min(0).max(1000).optional(),
  description: Joi.string().min(5).max(1000).optional(),
});

export const statusUpdateValidationSchema = Joi.object({
  status: Joi.boolean().required(),
});

export const adsValidationSchema = Joi.object({
  name: Joi.string().min(3).max(30).optional(),
  page: Joi.array().items(Joi.any()).min(4).max(8).optional(),
  categoryId: Joi.string().optional(),
});
