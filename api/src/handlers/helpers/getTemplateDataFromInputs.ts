import { InputFields } from "./getAllInputsFromForm";
import { AffirmationFieldList, fieldLists } from "./fieldLists";
import { YesNoMap } from "./fieldLists/common";
import { CNIFieldList } from "./fieldLists/cni";

type AffirmationTemplateData = Record<
  AffirmationFieldList | "uploads",
  string | File[]
>;
type CNITemplateData = Record<CNIFieldList | "uploads", string>;
type Errors = {
  errors: Error;
};

export function getTemplateDataFromInputs(
  inputs: InputFields,
  formType: "cni" | "affirmation"
): AffirmationTemplateData | CNITemplateData | Errors {
  const formFields = fieldLists[formType];
  const templateData = {};
  for (const field of formFields) {
    if (!inputs[field]) {
      return {
        errors: new Error(`Required field was missing: ${field}`),
      };
    }
    let answer = inputs[field].answer;
    if (inputs[field].type === "uploadField") {
      // add file to array
      continue;
    }
    if (inputs[field].type === "yesNoField") {
      answer = YesNoMap[inputs[field].answer.toString()];
    }
    templateData[field] = answer;
  }
  return templateData as AffirmationTemplateData | CNITemplateData;
}
