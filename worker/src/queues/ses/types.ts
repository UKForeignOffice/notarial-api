import { SendEmailOptions } from "notifications-node-client";
import { PayMetadata } from "../../types";
import { NotifyJob } from "../notify/types";

export interface FormField {
  key: string;
  title: string;
  type: string;
  answer: string | boolean | null;
}

export type SESJob = {
  subject: string;
  body: string;
  attachments: FormField[];
  reference: string;
  onComplete?: {
    queue: string;
    job: SESJob | NotifyJob;
  };
};

export type SESParseJob = {
  fields: FormField[];
  template: string;
  metadata: {
    reference: string;
    payment?: PayMetadata;
    type: string;
    postAlertOptions: {
      template: string;
      emailAddress: string;
      options: SendEmailOptions<any>;
    };
  };
};
