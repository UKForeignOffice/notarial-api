import logger, { Logger } from "pino";
import config from "config";
import { SendRawEmailCommand, SESClient, Template } from "@aws-sdk/client-ses";
import { createMimeMessage } from "mimetext";
import { AffirmationTemplateData, CNITemplateData } from "../../../handlers/helpers/getTemplateDataFromInputs";
import { ses } from "../../../SESClient";

export class SESService {
  templates: {
    cni?: string;
    affirmation?: string;
  } = {};
  logger: Logger;
  ses: SESClient;

  constructor() {
    this.templates.affirmation = config.get("affirmationTemplate");
    this.templates.cni = config.get("cniTemplate");
    this.logger = logger().child({ service: "SES" });
    this.ses = ses;
  }

  buildEmail(template: Template, fields: AffirmationTemplateData | CNITemplateData, uploads: object) {
    const message = createMimeMessage();
    message.setSender({
      name: "Getting Married Abroad Service",
      addr: config.get("senderEmail"),
    });
    message.setRecipient(config.get("submissionAddress"));
    try {
      message.setSubject(this.interpolateVars(template.SubjectPart, fields));
      for (const [field, file] of Object.entries(uploads)) {
        message.setAttachment(field, "application/pdf", file.toString());
      }
      message.setMessage("text/html", this.interpolateVars(template.HtmlPart, fields));
    } catch (err) {
      return {
        errors: err as Error,
      };
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
}
