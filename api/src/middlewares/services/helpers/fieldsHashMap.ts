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
