import Joi from 'joi';
import { testPassword } from '../utils';

export const userValidationSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .regex(/^(078|079|072|073)\d{7}$/)
    .message('Please provide a valid phone number start with 078/079/072/073'),
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

const PasswordPattern =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

export const resetPasswordSchema = Joi.object({
  password: Joi.string().required().pattern(PasswordPattern),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'confirm password must be the same as password',
  }),
});

export const emailValidation = Joi.object({
  email: Joi.string().email().required(),
});
export const personalValidationalSchema = Joi.object({
  name: Joi.string().min(3).max(30).optional(),
  photoUrl: Joi.string().optional(),
  gender: Joi.string().valid('male', 'female').optional(),
  birthdate: Joi.string()
    .pattern(
      /^(?:19|20)\d{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1\d|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)$/
    )
    .message('Please provide a valid birthdate in the format YYYY-MM-DD')
    .optional(),
  preferedlanguage: Joi.string().optional(),
  preferedcurrency: Joi.string().optional(),
  phone: Joi.string()
    .regex(/^(078|079|072|073)\d{7}$/)
    .message('Please provide a valid phone number start with 078/079/072/073'),
  address: Joi.string().optional(),
});
