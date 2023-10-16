import { AffirmationStructuredDataInput } from "./structureInputData/affirmation";
import { CNIStructuredDataInput } from "./structureInputData/cni";
import { InputFields } from "./getAllInputsFromForm";

export function convertTemplateToHtml(
  template: AffirmationStructuredDataInput | CNIStructuredDataInput
) {
  let result = {};
  for (const [key, templateVar] of Object.entries(template)) {
    result[key] = convertVarsToHtml(templateVar);
  }
}

function convertVarsToHtml(fields: InputFields) {
  let result = "";
  for (const [fieldName, fieldValue] of Object.entries(fields)) {
    result += `<p>${fieldName}: ${fieldValue}`;
  }
  return result;
}
