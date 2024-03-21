import { NextFunction, Request, Response } from "express";
import joi from "joi";
import { ApplicationError } from "../../../../ApplicationError";

const schema = joi.object({
  template: joi.string().valid("submission"),
  metadata: {
    reference: joi.string(),
    payment: joi.object(),
    type: joi.string().valid("affirmation", "cni", "exchange"),
    postAlertOptions: joi.object({
      emailAddress: joi.string(),
      options: {
        personalisation: joi.object(),
        reference: joi.string(),
      },
    }),
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
  const { staffService } = res.app.services;
  try {
    const jobId = await staffService.sendEmail(req.body);
    return {
      jobId,
    };
  } catch (e) {
    next(e);
    return;
  }
}
