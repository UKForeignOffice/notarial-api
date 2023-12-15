import { FormField } from "../../../types/FormField";
import { AnswersHashMap } from "../../../types/AnswersHashMap";

export function answersHashMap(fields: FormField[]) {
  return fields.reduce<AnswersHashMap>(
    (acc, field) => ({
      ...acc,
      [field.key]: field.answer as string | boolean,
    }),
    {}
  );
}
