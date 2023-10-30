import { FormDataBody } from "../../types";
import { FormField } from "../../types/FormField";

export interface InputFields {
  [key: string]: FormField;
}
export function fieldHashMapFromFormData(formData: FormDataBody) {
  return formData.questions?.reduce<InputFields>(flattenQuestions, {});
}

function flattenQuestions(accQuestions, currQuestion) {
  return {
    ...accQuestions,
    ...currQuestion.fields.reduce(flattenFields, {}),
  };
}

function flattenFields(accFields, currField) {
  return {
    ...accFields,
    [currField.key]: currField,
  };
}
