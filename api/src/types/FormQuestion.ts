import { FormField } from "./FormField";

export interface FormQuestion {
  question: string;
  fields: FormField[];
}
