/* eslint-disable import/no-unresolved */
import Joi from 'joi';

const regex = /^(?=.*\d)(?=.*\W+)(?=.*[A-Z])(?=.*[a-z]).{8,}$/;
const changePasswordValidationSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string()
    .required()
    .pattern(regex)
    .message(
      'please password should contain number,character,special character(@#),and at least 8 characters'
    ),
  confirmPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'confirm password must be the same as new password',
    }),
});

export default changePasswordValidationSchema;
