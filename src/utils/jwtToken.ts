import jwt from 'jsonwebtoken';
import getDatabaseConfig from '../config/config';

const { secret } = getDatabaseConfig();

// Verifies a token
export const verifyToken = (token: string): { email: string } | null => {
  const decoded = jwt.verify(token, secret) as { email: string };
  return decoded;
};

// Generates a token
interface TokenPayload {
  id?: string;
  email?: string;
}

export const signToken = (
  payload: TokenPayload,
  expiresIn: string = '2h'
): string => {
  const token = jwt.sign(payload, secret, { expiresIn });
  return token;
};
