import { FormField } from "../types/FormField";

/**
 * Curried function. `isFieldType` returns a function, which can be used within a filter method
 * @example `const fileFields = fields.filter(isFieldType("file"));`
 */
export function isFieldType(type: string) {
  return function (question: FormField): boolean {
    return question.type === type;
  };
}
