import { FormField } from "../../../types/FormField";
import { SESService } from "./SESService";
import { NotifyService } from "./NotifyService";
import logger, { Logger } from "pino";

// export interface EmailService {
//   sendEmail: (message: string) => Promise<any>;
//   buildEmailWithAttachments: (params: { subject: string; body: string; attachments: FormField[] }) => Promise<string>;
//   buildOathEmailBody: (fields: FormField[]) => string;
//   buildCNIEmailBody: () => void;
// }

export interface EmailServiceModel {
  sendEmail: (message: MailModel) => Promise<any>;
  buildEmail: (formData: FormField[], template: string, serviceType?: "ses" | "notify") => Promise<MailModel>;
  addAttachments?: (params: { subject: string; body: string; attachments: FormField[] }) => Promise<string>;
}

export interface NotifyMailModel {
  template: string;
  emailAddress: string;
  options: {
    personalisation: object;
    reference: string;
  };
}

export type SESMailModel = string;

export type MailModel = NotifyMailModel | SESMailModel;

export type StaffTemplate = "oath" | "cni";

export type UserTemplate = "standard" | "additionalInfoRequired";

export type Template = StaffTemplate | UserTemplate;

export class EmailService {
  ses: SESService;
  notify: NotifyService;
  logger: Logger;

  constructor({ fileService }) {
    this.logger = logger().child({ service: "Email" });
    this.ses = new SESService(fileService);
    this.notify = new NotifyService();
  }

  sendEmail(message: MailModel) {
    if (typeof message === "string") {
      return this.ses.sendEmail(message);
    }
    return this.notify.sendEmail(message);
  }

  buildEmail(formData: FormField[], serviceType: "ses" | "notify", template: Template) {
    this[serviceType].buildEmail(formData, template);
  }
}
