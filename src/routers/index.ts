import { Router } from 'express';
import UserRouter from './userRoute';
import ProductRouter from './productRoute';
import rolerouter from './role';
import authRouter from './authRoute';

const router = Router();
const routers: Router[] = [UserRouter, ProductRouter, authRouter];

router.use('/api', routers);
router.use('/api', rolerouter);

export default router;
