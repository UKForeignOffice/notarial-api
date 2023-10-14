import { FormDataBody } from "../../types";
import { FormField } from "../../types/FormField";

export interface InputFields {
  [key: string]: string | boolean;
}
export function getAllInputsFromForm(formData: FormDataBody) {
  return (
    formData.questions?.reduce<[InputFields, InputFields]>(
      (acc, curr) => {
        const uploadFields = getFields(curr.fields, "file");
        const otherFields = getFields(curr.fields);

        return [
          { ...acc[0], ...uploadFields },
          { ...acc[1], ...otherFields },
        ];
      },
      [{}, {}]
    ) ?? undefined
  );
}

function getFields(formFields: FormField[], type?: string) {
  return formFields.reduce((acc, curr) => {
    if (type && curr.type === type) {
      return {
        ...acc,
        [curr.key]: curr.answer,
      };
    }
    return {
      ...acc,
    };
  }, {});
}
