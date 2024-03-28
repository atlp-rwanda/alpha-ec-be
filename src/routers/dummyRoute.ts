import { Router } from 'express';
import { addition } from 'controllers/dummyController';

const router = Router();

router.get('/dummy', addition);
export default router;
