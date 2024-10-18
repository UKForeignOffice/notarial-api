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

export type PostalVariant = "inPerson" | "postal";

export type CNISubGroup = "cni" | "msc" | "cniAndMsc";
export type CertifyCopyTemplateType = CertifyCopyFormType | "adult" | "child";
export type MarriageTemplateType = MarriageFormType | "msc" | "cniAndMsc";
export type TemplateType = MarriageTemplateType | CertifyCopyTemplateType;
