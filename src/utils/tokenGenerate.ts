import jwt from 'jsonwebtoken';
import config from '../config/config';

export const userToken = (userId: string, email: string) => {
  return jwt.sign(
    {
      sub: userId,
      email,
    },
    config().secret,
    { expiresIn: '1h' }
  );
};
