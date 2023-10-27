import { NextFunction, Request, Response } from "express";
import { buildEmailData } from "../helpers/buildEmailData";
import { TemplateData } from "../helpers/getTemplateDataFromInputs";

export async function post(req: Request, res: Response, next: NextFunction) {
  const formType = req.body.metadata.type;
  const fields = buildEmailData(req.body, formType);

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

  const builtEmail = await sesService.buildEmail(template, templateVars, attachments);

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
