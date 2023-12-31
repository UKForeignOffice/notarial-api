import logger, { Logger } from "pino";
import { SendRawEmailCommand, SESClient, SESServiceException } from "@aws-sdk/client-ses";
import { ses } from "../../../SESClient";
import * as handlebars from "handlebars";
import { ApplicationError } from "../../../ApplicationError";
import { FormField } from "../../../types/FormField";
import * as templates from "./templates";
import * as additionalContexts from "./additionalContexts.json";
import { EmailServiceProvider, isStaffEmailTemplate, StaffEmailTemplate } from "./types";
import { createMimeMessage } from "mimetext";
import config from "config";
import { FileService } from "../FileService";
import { getFileFields, answersHashMap } from "../helpers";

export class SESService implements EmailServiceProvider {
  logger: Logger;
  ses: SESClient;
  fileService: FileService;
  templates: Record<StaffEmailTemplate, HandlebarsTemplateDelegate>;

  constructor({ fileService }) {
    this.logger = logger().child({ service: "SES" });
    this.ses = ses;
    this.fileService = fileService;
    this.templates = {
      affirmation: SESService.createTemplate(templates.staff.affirmation),
      cni: SESService.createTemplate(templates.staff.affirmation),
    };
  }

  async send(fields: FormField[], template: string, reference: string) {
    if (!isStaffEmailTemplate(template)) {
      throw new ApplicationError("SES", "TEMPLATE_NOT_FOUND", 400);
    }
    const emailArgs = await this.buildSendEmailArgs(fields, template, reference);
    return this.sendEmail(emailArgs, reference);
  }

  /**
   * @throws ApplicationError
   */
  private async sendEmail(message: SendRawEmailCommand, reference: string) {
    try {
      const response = await this.ses.send(message);
      this.logger.info(`Reference ${reference} staff email sent successfully with SES message id: ${response.MessageId}`);
      return response;
    } catch (err: SESServiceException | any) {
      throw new ApplicationError("SES", "API_ERROR", 400, err.message);
    }
  }

  private getEmailBody(fields: FormField[], template: StaffEmailTemplate) {
    if (template === "cni") {
      throw new ApplicationError("SES", "TEMPLATE_NOT_FOUND", 500, "CNI template has not been configured");
    }
    return this.templates[template]({
      questions: fields,
    });
  }

  private async buildSendEmailArgs(fields: FormField[], template: StaffEmailTemplate, reference: string): Promise<SendRawEmailCommand> {
    const answers = answersHashMap(fields);
    const emailBody = this.getEmailBody(fields, template);
    const post = answers.post ?? additionalContexts[answers.country as string].post;
    const message = await this.buildEmailWithAttachments({
      subject: `${template} | ${post} | ${reference}`,
      body: emailBody,
      attachments: getFileFields(fields),
    });
    return new SendRawEmailCommand({
      RawMessage: {
        Data: Buffer.from(message),
      },
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

  private static createTemplate(template: string) {
    return handlebars.compile(template);
  }
}
