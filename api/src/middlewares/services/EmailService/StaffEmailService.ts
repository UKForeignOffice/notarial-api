import { EmailService } from "./EmailService";
import { FormField } from "../../../types/FormField";
import { SESService } from "./SESService";
import * as templates from "./templates";
import { createMimeMessage } from "mimetext";
import config from "config";
import { ApplicationError } from "../../../ApplicationError";
import { FileService } from "../FileService";

export class StaffEmailService extends EmailService {
  templates: any;
  fileService: FileService;
  constructor({ sesService, fileService }) {
    super("SES", sesService);
    this.fileService = fileService;
    this.templates = {
      oath: SESService.createTemplate(templates.oath),
    };
  }

  buildEmail(fields: FormField[], template: "oath" | "cni", fileFields: FormField[], reference: string) {
    const emailBody = this.getEmailBody(fields, template);
    const emailParams = {
      subject: `${template} - ${reference}`,
      body: emailBody,
      attachments: fileFields,
    };
    return this.buildEmailWithAttachments(emailParams);
  }

  getEmailBody(fields: FormField[], template: "oath" | "cni") {
    return this.templates[template]({
      questions: fields,
    });
  }

  async buildEmailWithAttachments({ subject, body, attachments }: { subject: string; body: string; attachments: FormField[] }) {
    const message = createMimeMessage();
    message.setSender({
      name: "Getting Married Abroad Service",
      addr: config.get("senderEmail"),
    });
    message.setSubject(subject);

    message.addMessage({
      contentType: "text/html",
      data: body,
    });

    message.setRecipient(config.get("submissionAddress"));
    try {
      for (const attachment of attachments) {
        const { contentType, data } = await this.fileService.getFile(attachment.answer as string);

        message.addAttachment({
          filename: attachment.title,
          contentType,
          data: data.toString("base64"),
        });
      }
    } catch (err: any) {
      throw new ApplicationError("SES", "API_ERROR", 400, err.message);
    }

    return message.asRaw();
  }

  sendEmail(formData: FormField[]) {
    super.sendEmail(formData);
  }
}
