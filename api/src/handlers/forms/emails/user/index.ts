import { NextFunction, Request, Response } from "express";
import joi from "joi";
import { ApplicationError } from "../../../../ApplicationError";

const schema = joi.object({
  answers: joi.object(),
  metadata: {
    reference: joi.string(),
    payment: joi.object(),
    type: joi.string().valid("affirmation", "cni", "exchange"),
  },
});
export function validate(req: Request, _res: Response, next: NextFunction) {
  const result = schema.validate(req.body, { abortEarly: false, allowUnknown: true });
  if (result.error) {
    const message = `The supplied form data is invalid: ${result.error.details.map((error) => error.message).join("\n")}`;
    throw new ApplicationError("WEBHOOK", "VALIDATION", 400, message);
  }
  next();
}
export async function post(req: Request, res: Response, next: NextFunction) {
  const { userService } = res.app.services;
  try {
    const jobId = await userService.sendEmailToUser(req.body);
    return {
      jobId,
    };
  } catch (e) {
    next(e);
    return;
  }
}
