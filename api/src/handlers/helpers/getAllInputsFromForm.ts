import { FormDataBody } from "../../types";
import { FormField } from "../../types/FormField";

export interface InputFields {
  [key: string]: FormField;
}
export function getAllInputsFromForm(formData: FormDataBody) {
  return formData.questions?.reduce<InputFields>(
    (acc, curr) => ({
      ...acc,
      ...curr.fields.reduce(
        (fieldAcc, fieldCurr) => ({
          ...fieldAcc,
          [fieldCurr.key]: fieldCurr,
        }),
        {}
      ),
    }),
    {}
  );
}
