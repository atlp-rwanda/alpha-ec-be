import { Router, Request, Response } from 'express';
// import DummyRouter from "./dummyRoute";
import UserRouter from './userRoute';

const router = Router();
const routers: Router[] = [UserRouter];
router.use('/api', routers);
router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the API!👋🏽👋🏽' });
});

export default router;
