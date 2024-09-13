import { SendEmailOptions } from "notifications-node-client";

export interface NotifySendEmailArgs {
  template: string;
  emailAddress: string;
  options: SendEmailOptions<any>;
}

export type AlertJob = {
  template: string;
  emailAddress: string;
  reference: string;
  options: SendEmailOptions<{
    post: string;
    reference: string;
  }>;
};

type NotifyEmailTemplate = "inPerson" | "postal";
export type NotifyTemplateGroup = Record<NotifyEmailTemplate, string>;
