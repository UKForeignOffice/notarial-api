import { FormDataBody } from "../../types";
import { getTemplateDataFromInputs } from "./getTemplateDataFromInputs";
import { HttpException } from "../../middlewares/error-handlers";
import { ERRORS } from "../../errors";
import { fieldHashMapFromFormData } from "./fieldHashMapFromFormData";

export type Errors = {
  errors: Error;
};

export function buildEmailData(
  formBody: FormDataBody,
  formType: "cni" | "affirmation"
) {
  const fields = fieldHashMapFromFormData(formBody);
  if (!fields) {
    throw new HttpException(400, "400", ERRORS.webhook.EMPTY_TEMPLATE_DATA);
  }
  const templateData = getTemplateDataFromInputs(fields, formType);
  return templateData;
}
