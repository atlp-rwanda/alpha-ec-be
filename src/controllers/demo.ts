import express, { Request, Response, Application, NextFunction } from "express";

export function createServer() {
  const app: Application = express();

  app.get("/dummy", (req: Request, res: Response, next: NextFunction) => {
    res.send("okay");
    next();
  });
  return app;
}
