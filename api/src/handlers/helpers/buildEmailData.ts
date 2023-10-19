import { getAllInputsFromForm } from "./getAllInputsFromForm";
import { FormDataBody } from "../../types";
// import { getAffirmationStructuredDataInput } from "./structureInputData/affirmation";
// import { getCNIStructuredDataInput } from "./structureInputData/cni";
//
// const dataInputMap = {
//   affirmation: getAffirmationStructuredDataInput,
//   cni: getCNIStructuredDataInput,
// };
export function buildEmailData(formBody: FormDataBody) {
  const fields = getAllInputsFromForm(formBody);
  if (!fields) {
    return {
      errors: new Error("Malformed form data: No questions property found"),
    };
  }
  return fields;
}
