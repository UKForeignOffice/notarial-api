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
  return {
    uploadFields,
    templateData: dataInputMap[type](otherFields),
  };
}
