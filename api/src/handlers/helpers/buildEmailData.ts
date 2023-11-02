import { getAllInputsFromForm } from "./getAllInputsFromForm";
import { FormDataBody } from "../../types";
import { getTemplateDataFromInputs } from "./getTemplateDataFromInputs";

export type Errors = {
  errors: Error;
};

export function buildEmailData(
  formBody: FormDataBody,
  formType: "cni" | "affirmation"
) {
  const fields = getAllInputsFromForm(formBody);
  if (!fields) {
    return {
      errors: new Error("Malformed form data: No questions property found"),
    } as Errors;
  }
  const templateData = getTemplateDataFromInputs(fields, formType);
  return templateData;
}
