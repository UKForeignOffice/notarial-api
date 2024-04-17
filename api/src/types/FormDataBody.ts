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
    SKIP_QUEUEING_STAFF_EMAIL?: boolean;
    SKIP_QUEUEING_USER_EMAIL?: boolean;
  };
  fees?: {
    paymentReference: string;
  };
}
