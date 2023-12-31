import { FormField } from "../../../types/FormField";

export function getFileFields(fields: FormField[]) {
  return fields.reduce<FormField[]>((acc, field) => {
    if (field.type === "FileUploadField") {
      return [...acc, field];
    }
    return [...acc];
  }, []);
}
