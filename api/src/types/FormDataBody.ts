import { FormQuestion } from "./FormQuestion";

export interface FormDataBody {
  name: string;
  questions: FormQuestion[];
  metadata: {
    paymentSkipped: boolean;
    type: "oath" | "cni";
    [key: string]: any;
  };
  fees?: {
    paymentReference: string;
  };
}
