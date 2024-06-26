import { NextFunction, Request, Response } from "express";
import joi from "joi";
import { ApplicationError } from "../../../../ApplicationError";
const schema = joi.object({
  template: joi.string().valid("submission").required(),
  fields: joi
    .array()
    .items(
      joi.object().keys({
        key: joi.string().required(),
        type: joi.string().required(),
        title: joi.string().optional(),
        answer: joi.any().optional(),
      })
    )
    .required(),
  metadata: {
    reference: joi.string().required(),
    payment: joi.object(),
  },
});

export function validate(req: Request, _res: Response, next: NextFunction) {
  const result = schema.validate(req.body, { abortEarly: false, allowUnknown: true });
  if (result.error) {
    const message = `The supplied form data is invalid: ${result.error.details.map((error) => error.message).join(",")}`;
    next(new ApplicationError("SES", "PROCESS_VALIDATION", 400, message));
  }
  next();
}
export async function post(req: Request, res: Response, next: NextFunction) {
  const { staffService } = res.app.services;

  try {
    const jobId = await staffService.sendEmail(req.body);
    return res.send({
      jobId,
    });
  } catch (e) {
    next(e);
    return;
  }
}
