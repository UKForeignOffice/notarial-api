import { NextFunction, Request, Response } from "express";
import { HttpException } from "../../middlewares/error-handlers";
import { buildEmailData } from "../helpers/buildEmailData";
// import { convertTemplateToHtml } from "../helpers/convertTemplateToHtml";
// import { CNIStructuredDataInput } from "../helpers/structureInputData/cni";
// import { getFilePromise } from "../helpers/getFilePromise";
import { ERRORS as globalErrors } from "../../errors";

const uploadFieldNames = ["uploadField1", "uploadField2"];

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

  const { fileService } = res.locals.app.services;

  const filePromises: Promise<ArrayBuffer>[] = uploadFieldNames.map(
    (fieldName) =>
      new Promise(async () => {
        return await fileService.getFile(fields[fieldName].answer);
      })
  );

  const files = await Promise.all(filePromises);
  const attachments = Object.keys(uploadFieldNames).reduce(
    (acc, curr, currentIndex) => ({
      ...acc,
      [curr]: files[currentIndex],
    }),
    {}
  );
  req.log.info(["attachments"], JSON.stringify(attachments));

  res.status(200).send("Request successful");
}
