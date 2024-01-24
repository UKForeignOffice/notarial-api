import { Request, Response, NextFunction } from "express";
import joi from "joi";
import { ApplicationError } from "../ApplicationError";

const questionSchema = joi.object().keys({
  category: joi.string().optional(),
  question: joi.string().required(),
  fields: joi.array().items(joi.any()).min(1).required(),
});

const webhookOutputSchema = joi.object().keys({
  name: joi.string().required(),
  questions: joi.array().items(questionSchema).required(),
  metadata: joi.object().required(),
});
export function validationHandler(req: Request, _res: Response, next: NextFunction) {
  const result = webhookOutputSchema.validate(req.body);
  if (result.error) {
    const message = `The supplied form data is invalid: ${result.error.details.map((error) => error.message).join("\n")}`;
    throw new ApplicationError("WEBHOOK", "VALIDATION", 400, message);
  }
  next();
}
