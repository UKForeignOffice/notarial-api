import { SendEmailOptions } from "notifications-node-client";

export type NotifyJob = {
  template: string;
  emailAddress: string;
  options: SendEmailOptions<any>;
};
