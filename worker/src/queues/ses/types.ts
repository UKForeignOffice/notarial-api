import { SendEmailOptions } from "notifications-node-client";

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
  postAlertOptions: {
    template: string;
    emailAddress: string;
    options: SendEmailOptions<any>;
  };
};
