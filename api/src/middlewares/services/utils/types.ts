import { SendEmailOptions } from "notifications-node-client";
import { FormType } from "../../../types/FormDataBody";

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
type NotifyCNISubGroup = Record<"cni" | "msc" | "cniAndMsc", NotifyTemplateSubGroup>;
type NotifyCertifyCopySubGroup = Record<"adult" | "child", NotifyTemplateSubGroup>;
type NotifyTemplateSubGroup = Record<NotifyEmailTemplate, string>;
export type NotifyTemplateGroup = Record<FormType, NotifyCNISubGroup | NotifyCertifyCopySubGroup | NotifyTemplateSubGroup>;
