import { SendEmailOptions } from "notifications-node-client";
import { FormField } from "../../../types/FormField";

export interface NotifySendEmailArgs {
  template: string;
  emailAddress: string;
  options: SendEmailOptions<any>;
}

export interface EmailServiceProvider {
  send: (fields: FormField[], template: string, reference: string) => Promise<any>;
  buildSendEmailArgs: (fields: FormField[], template: string, reference: string) => any;
  sendEmail: (args: ReturnType<EmailServiceProvider["buildSendEmailArgs"]>, reference: string) => Promise<any>;
}
