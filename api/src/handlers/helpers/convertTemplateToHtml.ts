import { AffirmationStructuredDataInput } from "./structureInputData/affirmation";
import { CNIStructuredDataInput } from "./structureInputData/cni";
import { InputFields } from "./getAllInputsFromForm";
import { AffirmationTemplate } from "../../types/AffirmationTemplate";
import { CNITemplate } from "../../types/CNITemplate";

export function convertTemplateToHtml(
  template: AffirmationStructuredDataInput | CNIStructuredDataInput
): AffirmationTemplate | CNITemplate {
  let result = {};
  for (const [key, templateVar] of Object.entries(template)) {
    result[key] = convertVarsToHtml(templateVar);
  }
  return result as any;
}

function convertVarsToHtml(fields: InputFields) {
  let result = "";
  for (const [fieldName, fieldValue] of Object.entries(fields)) {
    result += `<p>${fieldName}: ${fieldValue}`;
  }
  return result;
}
