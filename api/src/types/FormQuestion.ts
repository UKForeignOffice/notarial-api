import { FormField } from "./FormField";

export interface FormQuestion {
  category?: string;
  question: string;
  fields: FormField[];
}
