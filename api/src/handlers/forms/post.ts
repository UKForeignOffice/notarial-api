import { NextFunction, Request, Response } from "express";
import { HttpException } from "../../middlewares/error-handlers";
import { buildEmailData } from "../helpers/buildEmailData";
import { convertTemplateToHtml } from "../helpers/convertTemplateToHtml";
import { CNIStructuredDataInput } from "../helpers/structureInputData/cni";
import { retrieveAndEncryptFiles } from "../helpers/retrieveAndEncryptFiles";

export async function post(req: Request, res: Response, next: NextFunction) {
  // const { uploadFields, templateData, errors } = buildEmailData(
  //   "cni",
  //   req.body
  // );
  //
  // if (errors) {
  //   const error = new HttpException(400, "W001", errors.message);
  //   next(error);
  // }
  //
  // if (!templateData) {
  //   const error = new HttpException(
  //     400,
  //     "W001",
  //     "No template data was returned"
  //   );
  //   next(error);
  // }

  // const { fileService, encryptionService } = res.locals.app.services;

  // const compiledTemplate = convertTemplateToHtml(
  //   templateData as CNIStructuredDataInput
  // );
  // let attachments = {};
  // if (uploadFields) {
  //   attachments = await retrieveAndEncryptFiles(
  //     uploadFields,
  //     fileService,
  //     encryptionService
  //   );
  // }

  res.status(200).send("Request successful");
}
