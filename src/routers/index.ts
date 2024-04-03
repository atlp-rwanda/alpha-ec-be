import { Router } from 'express';
import UserRouter from './userRoute';

const router = Router();
const routers: Router[] = [UserRouter];
router.use('/api', routers);

export default router;
