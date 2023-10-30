import logger, { Logger } from "pino";
import config from "config";
import {
  GetTemplateCommand,
  SendRawEmailCommand,
  SESClient,
  Template,
} from "@aws-sdk/client-ses";
import { ERRORS } from "../../errors";
import { createMimeMessage } from "mimetext";
import {
  AffirmationTemplateData,
  CNITemplateData,
} from "../../handlers/helpers/getTemplateDataFromInputs";
import { ses } from "../../SESClient";
import { ApplicationError } from "../../ApplicationError";

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
  async getTemplate(type: "cni" | "affirmation") {
    const getTemplateCommand = new GetTemplateCommand({
      TemplateName: this.templates[type],
    });

    try {
      const templateData = await this.ses.send(getTemplateCommand);
      return templateData.Template;
    } catch (e: Error | any) {
      this.logger.error(e);
      if (e.name === "TemplateDoesNotExistException") {
        return Promise.reject(
          new ApplicationError(
            "ses",
            "TEMPLATE_NOT_FOUND",
            500,
            ERRORS.ses.NO_TEMPLATE,
            {
              isOperational: true,
              exposeToClient: false,
            }
          )
        );
      }
    }
  }

  buildEmail(
    template: Template,
    fields: AffirmationTemplateData | CNITemplateData,
    uploads: object
  ) {
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
      message.setMessage(
        "text/html",
        this.interpolateVars(template.HtmlPart, fields)
      );
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

  interpolateVars(string: string = "", vars: object) {
    if (!string) {
      this.logger.error(ERRORS.ses.TEMPLATE_PART_MISSING);
      throw new Error("No string was supplied");
    }
    const varsInString = [...string.matchAll(/\{\{[a-zA-Z0-9]*}}/g)];
    let parsedString = string.slice(0);
    varsInString.forEach((variable) => {
      const varRef = variable[0];
      const varValue = vars[varRef.slice(2, -2)];
      if (!varValue) {
        this.logger.error(ERRORS.ses.TEMPLATE_VAR_MISSING);
        throw new Error(`Missing required variable: ${varRef}`);
      }
      parsedString = parsedString.replace(varRef, varValue);
    });
    return parsedString;
  }

  handleSESError(err: Error) {
    this.logger.error(err);
  }
}
