import { FormField } from "../../../types/FormField";

export interface NotifySendEmailArgs {
  template: string;
  emailAddress: string;
  options: {
    personalisation: object;
    reference: string;
  };
}

export interface EmailServiceProvider {
  send: (fields: Record<string, FormField>, template: string, reference: string) => Promise<any>;
  buildSendEmailArgs: (fields: Record<string, FormField>, template: string, reference: string) => any;
  sendEmail: (args: ReturnType<EmailServiceProvider["buildSendEmailArgs"]>, reference: string) => Promise<any>;
}
