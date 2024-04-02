import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import Database from '../database';
import {sendResponse} from '../utils';
import config from '../config/config'

/// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////


export async function checkUserCredentials(
  email: string,
  password: string,
  done: Function
) {
  try {
    // checking if user with this email exists in database

    const user = await Database.User.findOne({
      where: { email },
    });

    // comparing password entered with password stored in database

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return done(null, false, { message: 'User not found' });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}

passport.use(
  new LocalStrategy({ usernameField: 'email' }, checkUserCredentials)
);

const validatingUser = async (req: Request, res: Response) => {
  passport.authenticate(
    'local',
    { session: false },
    async(err: any, user: any) => {
        
      //test if uer not found

        if (!user) return sendResponse<null>(res, 400, null, 'User not found');

        //generate token 
        
        const { secret }  = config()
        const token = jwt.sign({ id: user.id }, secret, { expiresIn: '2h' });

        //store token in header and cookie

        res.cookie('token', token);
        res.header('Authorization', `Bearer ${token}`);

        //generate success Response
        
        return sendResponse<string>(res, 200, token, 'Logged In Successfully');
    }
  )(req, res);
};

export default validatingUser;
