import { Router } from 'express';
import { createUser } from '../controllers/userController';
import { validationMiddleware } from '../middleware';
import {userValidationSchema} from '../validations'

const router = Router();

router.post('/users/register', validationMiddleware(userValidationSchema), createUser);
router.delete('/')

export default router;
