import bcrypt from 'bcryptjs';
import Database from '../database';

export const checkLoginCredentials = async (
  email: string,
  password: string
) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const user = await Database.User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return null;
    }
    return user;
  } catch (err) {
    throw err;
  }
};
