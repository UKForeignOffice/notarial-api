import { FormQuestion } from "./FormQuestion";

export interface FormDataBody {
  name: string;
  questions: FormQuestion[];
  metadata: {
    paymentSkipped: boolean;
  };
  fees?: {
    paymentReference: string;
  };
}
