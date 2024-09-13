import { FormField } from "../../../types/FormField";
import { NotifySendEmailArgs } from "../utils/types";
import { CertifyCopyFormType, MarriageFormType, PayMetadata } from "../../../types/FormDataBody";

export type PaymentViewModel = {
  id: string;
  status: string;
  total: string;
  url: string;
  allTransactionsByCountry: {
    url: string;
    country: string;
  };
};

export type CertifyCopyProcessQueueData = {
  fields: FormField[];
  metadata: {
    reference: string;
    payment?: PayMetadata;
    type: CertifyCopyFormType;
  };
};

export type MarriageProcessQueueData = {
  fields: FormField[];
  metadata: {
    reference: string;
    payment?: PayMetadata;
    type: MarriageFormType;
    postal?: boolean;
  };
};
export type ProcessQueueData = CertifyCopyProcessQueueData & MarriageProcessQueueData;

// TODO:- share this type between worker and api
export type SESSendJob = {
  subject: string;
  body: string;
  attachments: FormField[];
  reference: string;
  onComplete?: {
    queue: string;
    job?: SESSendJob | NotifySendEmailArgs;
  };
};
