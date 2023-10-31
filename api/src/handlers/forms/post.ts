import { NextFunction, Request, Response } from "express";
import { FormDataBody } from "../../types";

export async function post(req: Request, res: Response, next: NextFunction) {
  const { submitService } = res.locals.app.services;

  const formType = req.body.metadata.type ?? "oath";

  const submission = req.body as FormDataBody;
  await submitService.submitForm(submission);

  if (!res) {
    next();
  }

  req.log.info(["Email sent successfully"] as any);

  res.status(200).send({
    message: "Email sent successfully",
    reference: "PYE-1234",
  });
}
