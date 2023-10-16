import { NextFunction, Request, Response } from "express";
import { HttpException } from "../../../middlewares/error-handlers";
import { buildEmailData } from "../../helpers/buildEmailData";

export async function post(req: Request, res: Response, next: NextFunction) {
  try {
    req.log.info(["/email", "request body"], req.body);
    const [uploadFields, inputData] = buildEmailData("affirmation", req.body);

    res.status(200).send("Request successful");
  } catch (err) {
    const error = new HttpException(500, "500", (err as Error).message);
    next(error);
  }
}
