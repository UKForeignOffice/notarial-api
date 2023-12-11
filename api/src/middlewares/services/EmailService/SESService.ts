import logger, { Logger } from "pino";
import { SendRawEmailCommand, SESClient, SESServiceException } from "@aws-sdk/client-ses";
import { ses } from "../../../SESClient";
import * as handlebars from "handlebars";
import { ApplicationError } from "../../../ApplicationError";
import { FormField } from "../../../types/FormField";
import * as templates from "./templates";
import * as additionalContexts from "./additionalContexts.json";
import { EmailServiceProvider } from "./types";
import { createMimeMessage } from "mimetext";
import config from "config";
import { FileService } from "../FileService";
import { getFileFields } from "../helpers";

export class SESService implements EmailServiceProvider {
  logger: Logger;
  ses: SESClient;
  fileService: FileService;
  templates: any;

  constructor({ fileService }) {
    this.logger = logger().child({ service: "SES" });
    this.ses = ses;
    this.fileService = fileService;
    this.templates = {
      oath: SESService.createTemplate(templates.staff.oath),
    };
  }

  async send(fields: Record<string, FormField>, template: string, reference: string) {
    const emailArgs = await this.buildSendEmailArgs(fields, template, reference);
    return this.sendEmail(emailArgs, reference);
  }

  /**
   * @throws ApplicationError
   */
  async sendEmail(message: SendRawEmailCommand, reference: string) {
    try {
      const response = await this.ses.send(message);
      this.logger.info(`Reference ${reference} staff email sent successfully with SES message id: ${response.MessageId}`);
      return response;
    } catch (err: SESServiceException | any) {
      this.logger.error(err);
      throw new ApplicationError("SES", "API_ERROR", 400, err.message);
    }
  }

  getEmailBody(fields: Record<string, FormField>, template: string) {
    if (template === "cni") {
      throw new ApplicationError("SES", "TEMPLATE_NOT_FOUND", 500, "CNI template has not been configured");
    }
    return this.templates[template]({
      questions: fields,
    });
  }

  async buildSendEmailArgs(fields: Record<string, FormField>, template: string, reference: string): Promise<SendRawEmailCommand> {
    const emailBody = this.getEmailBody(fields, template);
    const postField = fields.post;
    const post = postField?.answer ?? additionalContexts[fields.country.answer as string].post;
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
