import { NextFunction, Request, Response } from "express";
import { HttpException } from "../../middlewares/error-handlers";
import { buildEmailData } from "../helpers/buildEmailData";
import { ERRORS as globalErrors } from "../../errors";
import { TemplateData } from "../helpers/getTemplateDataFromInputs";

export async function post(req: Request, res: Response, next: NextFunction) {
  const formType = req.body.metadata.type;
  const fields = buildEmailData(req.body, formType);

  if (!fields) {
    const error = new HttpException(
      400,
      "W001",
      globalErrors.webhook.EMPTY_TEMPLATE_DATA
    );
    next(error);
  }

  if ("errors" in fields) {
    const error = new HttpException(
      400,
      "W001",
      (fields.errors as Error).message
    );
    next(error);
  }

  const { uploads, templateVars } = fields as TemplateData;

  const { fileService, sesService } = res.locals.app.services;

  const filePromises: Promise<ArrayBuffer>[] = [];

  for (const url in uploads) {
    filePromises.push(
      new Promise(async () => {
        return await fileService.getFile(url);
      })
    );
  }

  const files = await Promise.all(filePromises);
  const attachments = Object.keys(uploads).reduce(
    (acc, curr, currentIndex) => ({
      ...acc,
      [curr]: files[currentIndex],
    }),
    {}
  );

  const template = await sesService.getTemplate(formType);
  if (!template) {
    next();
  }

  const builtEmail = await sesService.buildEmail(
    template,
    templateVars,
    attachments
  );

  if (builtEmail.errors) {
    next();
  }

  const emailRes = await sesService.sendEmail(builtEmail);

  if (!res) {
    next();
  }

  req.log.info(["Email sent successfully"], emailRes as any);

  res.status(200).send({
    message: "Email sent successfully",
    reference: "PYE-1234",
  });
}
