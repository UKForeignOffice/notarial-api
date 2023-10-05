import { NextFunction, Request, Response } from "express";
import { HttpException } from "../../middlewares/error-handlers";

export async function post(_req: Request, res: Response, next: NextFunction) {
  try {
    res.status(200).send("Request successful");
  } catch (err) {
    const error = new HttpException(500, "500", (err as Error).message);
    next(error);
  }
}
