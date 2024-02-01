import logger, { Logger } from "pino";
import * as handlebars from "handlebars";
import { ApplicationError } from "../../../ApplicationError";
import { FormField } from "../../../types/FormField";
import * as templates from "./templates";
import * as additionalContexts from "./additionalContexts.json";
import { EmailServiceProvider, isSESEmailTemplate, SESEmailTemplate } from "./types";
import config from "config";
import { getFileFields, answersHashMap } from "../helpers";
import PgBoss from "pg-boss";

type EmailArgs = {
  subject: string;
  body: string;
  attachments: FormField[];
  reference: string;
};

export class SESService implements EmailServiceProvider {
  logger: Logger;
  templates: Record<SESEmailTemplate, HandlebarsTemplateDelegate>;
  queue?: PgBoss;
  QUEUE_NAME = "SES";
  queueOptions: {
    retryBackoff: boolean;
    retryLimit: number;
  };

  constructor() {
    this.logger = logger().child({ service: "SES" });
    this.templates = {
      affirmation: SESService.createTemplate(templates.ses.affirmation),
      cni: SESService.createTemplate(templates.ses.affirmation),
    };
    const queue = new PgBoss({
      connectionString: config.get<string>("Queue.url"),
    });

    try {
      const retryBackoff = config.get<string>("SES.Retry.backoff") === "true";
      const retryLimit = parseInt(config.get<string>("SES.Retry.limit"));
      this.queueOptions = {
        retryBackoff,
        retryLimit,
      };
      this.logger.info(`${this.QUEUE_NAME} jobs will retry with retryBackoff: ${retryBackoff}, retryLimit: ${retryLimit}`);
    } catch (err) {
      this.logger.error({ err }, "Retry options could not be set, exiting");
      process.exit(1);
    }

    queue.start().then((pgboss) => {
      this.queue = pgboss;
      this.logger.info(`Sending messages to ${this.QUEUE_NAME}. Ensure that there is a handler listening to ${this.QUEUE_NAME}`);
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
  private async sendEmail(emailArgs: EmailArgs, reference: string) {
    const jobId = await this.queue?.send?.(this.QUEUE_NAME, emailArgs, {
      retryBackoff: true,
    });
    if (!jobId) {
      throw new ApplicationError("SES", "QUEUE_ERROR", 500, `Queueing failed for ${reference}`);
    }
    this.logger.info({ reference, jobId }, `reference ${reference}, SES queued with jobId ${jobId}`);
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

  private static createTemplate(template: string) {
    return handlebars.compile(template);
  }
}
