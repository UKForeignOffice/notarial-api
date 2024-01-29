import { SendEmailOptions } from "notifications-node-client";
import { FormField } from "../../../types/FormField";
import { notify } from "./templates";

export interface NotifySendEmailArgs {
  template: string;
  emailAddress: string;
  options: SendEmailOptions<any>;
}

export type SESEmailTemplate = "affirmation" | "cni";

export function isSESEmailTemplate(template: string): template is SESEmailTemplate {
  return template === "affirmation" || template === "cni";
}

export type NotifyEmailTemplate = "userConfirmation" | "postNotification";

export type NotifyPersonalisation = typeof notify.userConfirmation | typeof notify.postNotification;

export function isNotifyEmailTemplate(template: string): template is NotifyEmailTemplate {
  return template === "standard";
}

export interface EmailServiceProvider {
  send: (fields: FormField[], template: string, reference: string) => Promise<any>;
}
