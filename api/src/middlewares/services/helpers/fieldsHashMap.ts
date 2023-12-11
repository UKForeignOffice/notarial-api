import { FormField } from "../../../types/FormField";
import { FieldHashMap } from "../../../types/FieldHashMap";

export function fieldsHashMap(fields: FormField[]): FieldHashMap {
  return fields.reduce(
    (map, currField) => ({
      ...map,
      [currField.key]: currField,
    }),
    {}
  );
}
