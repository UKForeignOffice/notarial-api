import { SendEmailOptions } from "notifications-node-client";
import { FormField } from "../../../types/FormField";

export interface NotifySendEmailArgs {
  template: string;
  emailAddress: string;
  options: SendEmailOptions<any>;
}

export type StaffEmailTemplate = "affirmation" | "cni";

export function isStaffEmailTemplate(template: string): template is StaffEmailTemplate {
  return template === "affirmation" || template === "cni";
}

export type UserEmailTemplate = "standard";

export function isUserEmailTemplate(template: string): template is UserEmailTemplate {
  return template === "standard";
}

export interface EmailServiceProvider {
  send: (fields: FormField[], template: string, reference: string) => Promise<any>;
}
