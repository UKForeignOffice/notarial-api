import { FormField } from "../../../types/FormField";

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
