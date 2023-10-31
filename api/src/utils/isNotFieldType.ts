import { FormField } from "../types/FormField";

/**
 * Curried function. `isNotFieldType` returns a function, which can be used within a filter method
 * @example `const notFileFields = fields.filter(isNotFieldType("file"));`
 */
export function isNotFieldType(type: string) {
  return function (question: FormField): boolean {
    return question.type !== type;
  };
}
