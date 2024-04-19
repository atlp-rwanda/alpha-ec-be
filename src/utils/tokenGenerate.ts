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

export const decodeToken = (token: string) => {
  const decodedToken = jwt.decode(token);
  if (decodedToken && typeof decodedToken === 'object') {
    return decodedToken.id;
  }
  return null;
};
