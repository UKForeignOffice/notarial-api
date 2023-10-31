import logger, { Logger } from "pino";
import config from "config";
import { SendRawEmailCommand, SESClient, Template } from "@aws-sdk/client-ses";
import { createMimeMessage, MIMEType } from "mimetext";
import { AffirmationTemplateData, CNITemplateData } from "../../../handlers/helpers/getTemplateDataFromInputs";
import { ses } from "../../../SESClient";
import { FileService } from "../file";
import { FormField } from "../../../types/FormField";
import * as handlebars from "handlebars";
import * as fs from "fs";
import { ApplicationError } from "../../../ApplicationError";

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
      oath: SESService.createTemplate("oathSubmissionTemplate"),
    };
  }

  buildOathEmailBody(fields: FormField[]) {
    return this.templates.oath({
      questions: fields,
    });
  }

  buildCNIEmailBody() {
    throw new ApplicationError("ses", "NO_TEMPLATE", 500);
  }

  async buildEmailWithAttachments({ subject, body, attachments }: { subject: string; body: string; attachments: FormField[] }) {
    const message = createMimeMessage();
    message.setSender({
      name: "Getting Married Abroad Service",
      addr: config.get("senderEmail"),
    });
    message.setSubject(subject);
    message.setMessage("text/html", body);
    message.setRecipient(config.get("submissionAddress"));

    try {
      for (const attachment of attachments) {
        const file = await this.fileService.getFile(attachment.answer as string);
        const fileType = file.type as MIMEType;
        message.setAttachment(attachment.key, fileType, await file.text());
      }
    } catch (err) {
      // throw file error
    }
    return message.asRaw();
  }

  async sendEmail(message: string) {
    try {
      return await this.ses.send(
        new SendRawEmailCommand({
          RawMessage: {
            Data: Buffer.from(message),
          },
        })
      );
    } catch (err) {
      this.handleSESError(err as Error);
    }
    return;
  }

  handleSESError(err: Error) {
    this.logger.error(err);
  }

  private static createTemplate(name) {
    const templateFile = fs.readFileSync(name).toString("utf-8");
    return handlebars.compile(templateFile);
  }
}
