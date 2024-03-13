import { NextFunction, Request, Response } from "express";
import joi from "joi";
import { ApplicationError } from "../../../../ApplicationError";

const schema = joi.object({
  answers: joi.object(),
  metadata: {
    reference: joi.string(),
    payment: joi.object(),
    type: joi.string().valid("affirmation", "cni"),
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
export async function post(req: Request, res: Response) {
  const { notifyService } = res.app.services;
  return await notifyService.sendEmailToUser(req.body);
}
