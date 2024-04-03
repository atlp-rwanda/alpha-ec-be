// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Router, Request, Response } from 'express';
import UserRouter from './userRoute';

const router = Router();
const routers: Router[] = [UserRouter];
router.use('/api', routers);

export default router;
