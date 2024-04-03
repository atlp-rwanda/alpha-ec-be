import Joi from 'joi';
import { testPassword } from '../utils';

export const userValidationSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .regex(/^(?:\+?\d{12}|\d{10})$/)
    .message('Please provide a valid phone number'),
  address: Joi.string().required(),
  password: Joi.string()
    .required()
    .custom((value, helpers) => {
      const passwordError = testPassword(value);
      if (passwordError) {
        return helpers.error('any.invalid', { message: passwordError });
      }
      return value;
    }, 'Password validation'),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .required()
    .custom((value, helpers) => {
      const passwordError = testPassword(value);
      if (passwordError) {
        return helpers.error('any.invalid', { message: passwordError });
      }
      return value;
    }, 'Password validation'),
});
