import { Router } from 'express';
import { createUser } from '../controllers/userController';
import { isNewUserValid } from '../middleware/validateUser';

const router = Router();

router.post('/users', isNewUserValid, createUser);

export default router;
