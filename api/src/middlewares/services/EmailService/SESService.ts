import logger, { Logger } from "pino";
import config from "config";
import { SendRawEmailCommand, SESClient, SESServiceException } from "@aws-sdk/client-ses";
import { createMimeMessage } from "mimetext";
import { ses } from "../../../SESClient";
import { FileService } from "../FileService";
import { FormField } from "../../../types/FormField";
import * as handlebars from "handlebars";
import { ApplicationError } from "../../../ApplicationError";
import * as templates from "./templates";
import { SESMailModel, StaffTemplate } from "./EmailService";

export class SESService {
  logger: Logger;
  ses: SESClient;
  fileService: FileService;
  templates: any;

  constructor({ fileService }) {
    this.logger = logger().child({ service: "SES" });
    this.ses = ses;
    this.fileService = fileService;
    this.templates = {
      oath: SESService.createTemplate(templates.oath),
    };
  }

  buildEmail(fields: FormField[], template: StaffTemplate) {
    return this.templates[template]({
      questions: fields,
    });
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

    message.addMessage({
      contentType: "text/html",
      data: body,
    });

    message.setRecipient(config.get("submissionAddress"));
    try {
      for (const attachment of attachments) {
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
  async sendEmail(message: SESMailModel) {
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
