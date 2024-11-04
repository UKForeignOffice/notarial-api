import { Request, Response, NextFunction } from "express";
import joi from "joi";
import { ApplicationError } from "../ApplicationError";

const fieldsSchema = joi.object().keys({
  key: joi.string().required(),
  type: joi.string().required(),
  title: joi.string().optional(),
  answer: joi.any().optional(),
});

const questionSchema = joi.object().keys({
  index: joi.number().optional(),
  category: joi.string().allow(null).optional(),
  question: joi.string().required(),
  fields: joi.array().items(fieldsSchema).required(),
});

const webhookOutputSchema = joi.object().keys({
  name: joi.string().required(),
  questions: joi.array().items(questionSchema).required(),
  fees: joi.object().optional(),
  metadata: joi.object({
    pay: joi
      .object({
        payId: joi.string().optional(),
        state: joi.object().optional(),
        reference: joi.string().optional(),
      })
      .optional(),
    type: joi.string().valid("affirmation", "cni", "exchange", "certifyCopy", "requestDocument", "consularLetter").trim(),
  }),
});
export function validationHandler(req: Request, _res: Response, next: NextFunction) {
  const result = webhookOutputSchema.validate(req.body, { abortEarly: false, allowUnknown: true });
  if (result.error) {
    const message = `The supplied form data is invalid: ${result.error.details.map((error) => error.message).join(",")}`;
    throw new ApplicationError("WEBHOOK", "VALIDATION", 400, message);
  }
  next();
}
