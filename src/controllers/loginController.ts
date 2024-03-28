import express , {Request, Response} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Sequelize, json } from  'sequelize' ; 
import { DataTypes } from 'sequelize';
import dotenv from 'dotenv';
import loginValidation from '../validation/loginValidation';
dotenv.config()
const router = express.Router();
router.use(passport.initialize());
router.use(express.json())
const sequelize = new Sequelize({
    username: 'postgres',
    password: 'db123',
    database: 'test',
    host:'localhost',
    dialect: 'postgres',
});


const Registering = require('../database/models/register')(sequelize, DataTypes);
sequelize.authenticate().then(() => console.log('Connection established successfully')).catch((err:any) => console.log(err))

router.post('/register', async(req: Request, res:Response) => { 
    const {firstName, lastName, password, email} = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    await Registering.create({
        firstName,
        lastName,
        password: hashedPassword,
        email
    })
    res.send('user created')
})





async function validateUser(email:string, password:string, done:Function) {
    try {
        const user = await Registering.findOne({
            where: { email }
        });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return done(null, false, { message: "User not found" });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}



passport.use(new LocalStrategy( { usernameField: 'email' },validateUser));



router.post('/login', async (req:Request, res:Response, next:Function) => {
    passport.authenticate('local', { session: false }, async (err:any, user: any) => {
        try {
            loginValidation.parse(req.body)
            
            if (err) return next(err);
            if (!user) return res.status(400).json({ status: 400, error: "User Not found" });
            
            const tokenPayload = { email: user.email, password: user.password};
            const token = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN!);

            res.cookie("token", token);
            res.header('Authorization', `Bearer ${token}`);
            res.json({ status: 200, data: token });

        } catch (err: any) {
            res.status(401).json({error: err.issues[0].message})
            next(err);
        }
    })(req, res, next);
});





export default  router;

