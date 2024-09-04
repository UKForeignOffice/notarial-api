import { SendEmailOptions } from "notifications-node-client";

export interface NotifySendEmailArgs {
  template: string;
  emailAddress: string;
  options: SendEmailOptions<any>;
}

export type SESEmailTemplate = "submission";
type NotifyEmailTemplate = "userConfirmation" | "userPostalConfirmation";
export type NotifyTemplateGroup = Record<NotifyEmailTemplate, string>;
