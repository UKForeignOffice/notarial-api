import { InputFields } from "./getAllInputsFromForm";
import { fieldLists } from "./fieldLists";
import { YesNoMap } from "./fieldLists/common";

export function getTemplateDataFromInputs(
  inputs: InputFields,
  formType: "cni" | "affirmation"
) {
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
  return templateData;
}
