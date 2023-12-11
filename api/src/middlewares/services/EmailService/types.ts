import { SendEmailOptions } from "notifications-node-client";
import { FieldHashMap } from "../../../types/FieldHashMap";

export interface NotifySendEmailArgs {
  template: string;
  emailAddress: string;
  options: SendEmailOptions<any>;
}

export interface EmailServiceProvider {
  send: (fields: FieldHashMap, template: string, reference: string) => Promise<any>;
  buildSendEmailArgs: (fields: FieldHashMap, template: string, reference: string) => any;
  sendEmail: (args: ReturnType<EmailServiceProvider["buildSendEmailArgs"]>, reference: string) => Promise<any>;
}
