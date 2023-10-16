import { getAllInputsFromForm } from "./getAllInputsFromForm";
import { FormDataBody } from "../../types";
import { getAffirmationStructuredDataInput } from "./structureInputData/affirmation";
import { getCNIStructuredDataInput } from "./structureInputData/cni";

const dataInputMap = {
  affirmation: getAffirmationStructuredDataInput,
  cni: getCNIStructuredDataInput,
};
export function buildEmailData(
  type: "affirmation" | "cni",
  formBody: FormDataBody
) {
  const [uploadFields, otherFields] = getAllInputsFromForm(formBody);
  if (!uploadFields && !otherFields) {
    return {
      errors: new Error("Malformed form data: No questions property found"),
    };
  }
  return {
    uploadFields,
    templateData: dataInputMap[type](otherFields),
  };
}
