// import { dummyRequest } from "../controllers/dummyController";
// import { Router } from "express";
import { Router } from 'express';
import { dummyRequest } from '../controllers/dummyController'

// const router = Router();

router.get('/dummy', dummyRequest);
export default router;
