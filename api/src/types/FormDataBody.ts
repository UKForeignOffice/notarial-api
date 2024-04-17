import { FormQuestion } from "./FormQuestion";

type PayState = {
  status: "created" | "started" | "submitted" | "capturable" | "success" | "cancelled" | "error";
  finished: boolean;
};

export type FormType = "affirmation" | "cni" | "exchange";

type FailedPayState = {
  status: "failed";
  message: string;
  code: string;
  finished: boolean;
};

export type PayMetadata = {
  payId: string;
  reference: string;
  state: PayState | FailedPayState;
};

export interface FormDataBody {
  name: string;
  questions: FormQuestion[];
  metadata: {
    paymentSkipped: boolean;
    type: FormType;
    pay?: PayMetadata;
    [key: string]: any;
  };
  fees?: {
    paymentReference: string;
  };
}
