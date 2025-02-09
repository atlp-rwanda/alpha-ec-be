import { Router } from 'express';
import UserRouter from './userRoute';
import ProductRouter from './productRoute';
import rolerouter from './role';
import authRouter from './authRoute';
import categoryRouter from './categoryRoute';
import wishlistRouter from './wishlistRoute';
import reviewRouter from './reviewRoute';
import routercart from './cartRoutes';
import statsRoute from './statsRoute';
import routerNotification from './notification';
import orderRouter from './orderRouter';

const router = Router();
const routers: Router[] = [
  UserRouter,
  ProductRouter,
  authRouter,
  categoryRouter,
  wishlistRouter,
  reviewRouter,
  rolerouter,
  routercart,
  statsRoute,
  routerNotification,
  orderRouter,
];

router.use('/api', routers);

export default router;
