import { Router, Request, Response } from "express";
import DummyRouter from "./dummyRoute";



const router = Router();
const routers: Router[] = [DummyRouter];
router.use("/api", routers);
router.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the API!👋🏽👋🏽" });
});

export default router;
