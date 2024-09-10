import { FormField } from "../../../types/FormField";
import { NotifySendEmailArgs, SESEmailTemplate } from "../utils/types";
import { FormType, PayMetadata } from "../../../types/FormDataBody";

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

export type ProcessQueueData = {
  fields: FormField[];
  template: SESEmailTemplate;
  metadata: {
    reference: string;
    payment?: PayMetadata;
    type: FormType;
    postal?: boolean;
  };
};

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
