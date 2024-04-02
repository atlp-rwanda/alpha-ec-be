import Joi from 'joi';

export const userValidationSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
     .regex(/^(?:\+?\d{12}|\d{10})$/)
     .message('Please provide a valid phone number'),
  address: Joi.string().required(),
  password: Joi.string().required().custom((value, helpers) => {
    const passwordError = testPassword(value);
    if (passwordError) {
      return helpers.error('any.invalid', { message: passwordError });
    }
    return value; 
 }, 'Password validation'),
 });
export const testPassword = (password: string) => {
  if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%^&+=!]).{6,}$/.test(password)) {
    let error = 'Please provide a password with ';
    if (!/[A-Za-z]/.test(password)) {
      error += 'At least one letter, ';
    }
    if (!/\d/.test(password)) {
      error += 'At least one number, ';
    }
    if (!/[@#$%^&+=!]/.test(password)) {
      error += 'At least one special character (@#$%^&+=!), ';
    }
    if (password.length < 8) {
      error += 'Minimum length of 8';
    }
    return error;
  }
  return null;
};


export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().custom((value, helpers) => {
    const passwordError = testPassword(value);
    if (passwordError) {
      return helpers.error('any.invalid', { message: passwordError });
    }
    return value; 
 }, 'Password validation'),
 });

