import logger, { Logger } from "pino";
import config from "config";
import { SendRawEmailCommand, SESClient, SESServiceException } from "@aws-sdk/client-ses";
import { createMimeMessage } from "mimetext";
import { ses } from "../../../SESClient";
import { FileService } from "../file";
import { FormField } from "../../../types/FormField";
import * as handlebars from "handlebars";
import { ApplicationError } from "../../../ApplicationError";
import { default as oathTemplate } from "./oathSubmissionTemplate";
import { EmailService } from "./EmailService";
export class SESService implements EmailService {
  logger: Logger;
  ses: SESClient;
  fileService: FileService;
  templates: any;

  constructor({ fileService }) {
    this.logger = logger().child({ service: "SES" });
    this.ses = ses;
    this.fileService = fileService;
    this.templates = {
      oath: SESService.createTemplate(oathTemplate),
    };
  }

  buildOathEmailBody(fields: FormField[]) {
    return this.templates.oath({
      questions: fields,
    });
  }

  buildCNIEmailBody() {
    //TODO: implement
    throw new ApplicationError("SES", "NO_TEMPLATE", 500);
  }

  async buildEmailWithAttachments({ subject, body, attachments }: { subject: string; body: string; attachments: FormField[] }) {
    const message = createMimeMessage();
    message.setSender({
      name: "Getting Married Abroad Service",
      addr: config.get("senderEmail"),
    });
    message.setSubject(subject);

    // @ts-ignore - these types are wrong!
    message.addMessage({
      contentType: "text/html",
      data: body,
    });

    message.setRecipient(config.get("submissionAddress"));
    try {
      for (const attachment of attachments) {
        // const file = new Blob();
        const { contentType, data } = await this.fileService.getFile(attachment.answer as string);

        // @ts-ignore - these types are wrong!
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

  /**
   * @throws ApplicationError
   */
  async sendEmail(message: string) {
    try {
      return await this.ses.send(
        new SendRawEmailCommand({
          RawMessage: {
            Data: Buffer.from(message),
          },
        })
      );
    } catch (err: SESServiceException | any) {
      this.logger.error(err);
      throw new ApplicationError("SES", "API_ERROR", 400, err.message);
    }
  }

  private static createTemplate(template: string) {
    return handlebars.compile(template);
  }
}
