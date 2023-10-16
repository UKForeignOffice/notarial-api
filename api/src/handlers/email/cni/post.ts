import { NextFunction, Request, Response } from "express";
import { HttpException } from "../../../middlewares/error-handlers";
import { buildEmailData } from "../../helpers/buildEmailData";

export async function post(req: Request, res: Response, next: NextFunction) {
  try {
    req.log.info(["/email/cni", "request body"], req.body);
    const { uploadFields, templateData, errors } = buildEmailData(
      "cni",
      req.body
    );

    if (errors) {
      const error = new HttpException(400, "W001", errors.message);
      next(error);
    }

    res.status(200).send("Request successful");
  } catch (err) {
    const error = new HttpException(500, "500", (err as Error).message);
    next(error);
  }
}
