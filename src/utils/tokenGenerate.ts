import jwt from 'jsonwebtoken';
import config from '../config/config';
import Database from '../database';

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

export const findUsername = async (id: string) => {
  const result = await Database.User.findOne({ where: { id } });
  return result?.name;
};
