import { FormField } from "../../../types/FormField";
import { FormQuestion } from "../../../types/FormQuestion";

export function fieldsHashMap(fields: FormField[]): Record<string, FormField> {
  return fields.reduce(
    (map, currField) => ({
      ...map,
      [currField.key]: currField,
    }),
    {}
  );
}

export function getFileFields(fields: Record<string, FormField>) {
  return Object.values(fields).reduce<FormField[]>((acc, field) => {
    if (field.type === "FileUploadField") {
      return [...acc, field];
    }
    return [...acc];
  }, []);
}

export function flattenQuestions(questions: FormQuestion[]) {
  return questions.flatMap(({ fields }) => {
    return fields;
  });
}
