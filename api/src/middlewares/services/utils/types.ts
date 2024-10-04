import { SendEmailOptions } from "notifications-node-client";
import { CertifyCopyFormType, FormType, MarriageFormType } from "../../../types/FormDataBody";

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

export type NotifyEmailTemplate = "inPerson" | "postal";
type NotifyCNISubGroup = Record<"cni" | "msc" | "cniAndMsc", NotifyTemplateSubGroup>;
type NotifyCertifyCopySubGroup = Record<"adult" | "child", NotifyTemplateSubGroup>;
type NotifyTemplateSubGroup = Record<NotifyEmailTemplate, string>;
export type NotifyTemplateGroup = Record<FormType, NotifyCNISubGroup | NotifyCertifyCopySubGroup | NotifyTemplateSubGroup>;

export type CertifyCopyTemplateType = CertifyCopyFormType | "adult" | "child";
export type MarriageTemplateType = MarriageFormType | "msc" | "cniAndMsc";
export type TemplateType = MarriageTemplateType | CertifyCopyTemplateType;
