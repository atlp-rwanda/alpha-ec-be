import { dummyRequest } from "../controllers/dummyController";
import { Router } from "express";

const router = Router();

router.get("/dummy", dummyRequest);
export default router;
