import  dummyRequest  from "../controllers/dummyController";
import{createServer} from "../controllers/demo"
import { Router } from "express";

const router = Router();

router.get("/dummy", dummyRequest);
export default router;
