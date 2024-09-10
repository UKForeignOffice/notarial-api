import { FormQuestion } from "./FormQuestion";

type PayState = {
  status: "created" | "started" | "submitted" | "capturable" | "success" | "cancelled" | "error";
  finished: boolean;
};

export type MarriageFormType = "affirmation" | "cni" | "exchange" | "msc" | "cniAndMsc";
export type CertifyDocumentFormType = "certifyDocument";
export type FormType = MarriageFormType | CertifyDocumentFormType;

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
  total?: number;
};

export interface FormDataBody {
  name: string;
  questions: FormQuestion[];
  metadata: {
    paymentSkipped: boolean;
    type: FormType;
    pay?: PayMetadata;
    postal?: boolean;
    [key: string]: any;
  };
  fees?: {
    details: {
      description: string;
      amount: number;
    }[];
    total: number;
    referenceFormat: string;
    reportingColumns: Record<string, any>;
    paymentReference: string;
  };
}
