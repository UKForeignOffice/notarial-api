import { NextFunction, Request, Response } from "express";
import joi from "joi";
import { ApplicationError } from "../../../../ApplicationError";
import { FormType, MarriageFormType } from "../../../../types/FormDataBody";
import { MarriageCaseService } from "../../../../middlewares/services";

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
    type: joi.string().valid("affirmation", "cni", "exchange", "msc", "cniAndMsc"),
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
  const formType = req.body.metadata.type;
  if (!formType) {
    req.log.warn({ path: req.path }, `formType was missing from metadata, defaulting to marriageCaseService`);
  }

  const caseServiceName = getCaseServiceName(formType);
  const caseService: MarriageCaseService = res.app.services[caseServiceName];

  try {
    const jobId = await caseService.sendEmail(req.body);
    return res.send({
      jobId,
    });
  } catch (e) {
    next(e);
    return;
  }
}

const MARRIAGE_CASE_TYPES: Set<MarriageFormType> = new Set(["affirmation", "cni", "exchange", "msc", "cniAndMsc"]);
type ExpressCaseServices = Pick<Express.Application["services"], "marriageCaseService">;

function getCaseServiceName(formType: FormType): keyof ExpressCaseServices {
  if (MARRIAGE_CASE_TYPES.has(formType)) {
    return "marriageCaseService";
  }
  return "marriageCaseService";
}
