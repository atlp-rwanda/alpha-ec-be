import { Router } from 'express';
import UserRouter from './userRoute';
import ProductRouter from './productRoute';

const router = Router();
const routers: Router[] = [UserRouter, ProductRouter];
router.use('/api', routers);

export default router;
