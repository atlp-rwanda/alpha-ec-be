import jwt from 'jsonwebtoken';

export const userToken = (userId: string, email: string) => {
  return jwt.sign(
    {
      sub: userId,
      email,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: '1h' }
  );
};
