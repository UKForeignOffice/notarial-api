import { SendEmailOptions } from "notifications-node-client";
import { notify } from "./templates";

export interface NotifySendEmailArgs {
  template: string;
  emailAddress: string;
  options: SendEmailOptions<any>;
}

export type SESEmailTemplate = "affirmation" | "cni";
export type NotifyEmailTemplate = "userConfirmation" | "postNotification";

export type NotifyPersonalisation = typeof notify.userConfirmation | typeof notify.postNotification;
