import logger, { Logger } from "pino";
import config from "config";
import { SendRawEmailCommand, SESClient } from "@aws-sdk/client-ses";
import { createMimeMessage, MIMEType } from "mimetext";
import { ses } from "../../../SESClient";
import { FileService } from "../file";
import { FormField } from "../../../types/FormField";
import * as handlebars from "handlebars";
import * as fs from "fs";
import { ApplicationError } from "../../../ApplicationError";
import * as path from "path";

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
      oath: SESService.createTemplate("oathSubmissionTemplate.hbs"),
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
      addr: "pye@cautionyourblast.com",
    });
    console.log(message);
    message.setSubject(subject);

    // @ts-ignore
    message.addMessage({
      contentType: "text/html",
      data: body,
    });
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

  private static createTemplate(name: string) {
    // const templateFile = fs.readFileSync(path.join(__dirname, name)).toString("utf-8");
    return handlebars.compile(
      `
    <ul>
    {{#each questions}}
        <li>{{this.title}}: {{this.answer}}</li>
    {{/each}}
</ul>
`
    );
  }
}
