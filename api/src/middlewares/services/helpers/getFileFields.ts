import { FormField } from "../../../types/FormField";
import { FieldHashMap } from "../../../types/FieldHashMap";

export function getFileFields(fields: FieldHashMap) {
  return Object.values(fields).reduce<FormField[]>((acc, field) => {
    if (field.type === "FileUploadField") {
      return [...acc, field];
    }
    return [...acc];
  }, []);
}
