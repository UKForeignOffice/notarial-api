import logger, { Logger } from "pino";
import { SESClient } from "@aws-sdk/client-ses";
import { ses } from "../../../SESClient";
import * as handlebars from "handlebars";
import { ApplicationError } from "../../../ApplicationError";
import { FormField } from "../../../types/FormField";
import * as templates from "./templates";
import * as additionalContexts from "./additionalContexts.json";
import { EmailServiceProvider, isSESEmailTemplate, SESEmailTemplate } from "./types";
import { createMimeMessage } from "mimetext";
import config from "config";
import { FileService } from "../FileService";
import { getFileFields, answersHashMap } from "../helpers";
import PgBoss from "pg-boss";

export class SESService implements EmailServiceProvider {
  logger: Logger;
  ses: SESClient;
  fileService: FileService;
  templates: Record<SESEmailTemplate, HandlebarsTemplateDelegate>;
  queue?: PgBoss;

  constructor({ fileService }) {
    this.logger = logger().child({ service: "SES" });
    this.ses = ses;
    this.fileService = fileService;
    this.templates = {
      affirmation: SESService.createTemplate(templates.ses.affirmation),
      cni: SESService.createTemplate(templates.ses.affirmation),
    };
    const queue = new PgBoss({
      connectionString: config.get<string>("Queue.url"),
    });

    queue.start().then((pgboss) => {
      this.queue = pgboss;
    });
  }

  async send(fields: FormField[], template: string, reference: string) {
    if (!isSESEmailTemplate(template)) {
      throw new ApplicationError("SES", "TEMPLATE_NOT_FOUND", 400);
    }
    const emailArgs = await this.buildSendEmailArgs(fields, template, reference);
    return this.sendEmail(emailArgs, reference);
  }

  /**
   * @throws ApplicationError
   */
  private async sendEmail(emailArgs, reference: string) {
    const jobId = await this.queue?.send?.("ses", {
      data: {
        ...emailArgs,
      },
      options: {
        retryBackoff: true,
      },
    });
    if (!jobId) {
      throw new ApplicationError("SES", "QUEUE_ERROR", 500, `Queueing failed for ${reference}`);
    }
    this.logger.info({ reference, emailAddress, jobId }, `reference ${reference}, notify email queued with jobId ${jobId}`);
    return jobId;
  }

  private getEmailBody(fields: FormField[], template: SESEmailTemplate) {
    if (template === "cni") {
      throw new ApplicationError("SES", "TEMPLATE_NOT_FOUND", 500, "CNI template has not been configured");
    }
    return this.templates[template]({
      questions: fields,
    });
  }

  private async buildSendEmailArgs(fields: FormField[], template: SESEmailTemplate, reference: string) {
    const answers = answersHashMap(fields);
    const emailBody = this.getEmailBody(fields, template);
    const post = answers.post ?? additionalContexts[answers.country as string].post;

    return {
      subject: `${template} application, ${post} – ${reference}`,
      body: emailBody,
      attachments: getFileFields(fields),
      reference,
    };
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
