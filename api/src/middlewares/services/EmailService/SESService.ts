import logger, { Logger } from "pino";
import * as handlebars from "handlebars";
import { ApplicationError } from "../../../ApplicationError";
import { FormField } from "../../../types/FormField";
import * as templates from "./templates";
import additionalContexts from "./additionalContexts.json";
import { SESEmailTemplate } from "./types";
import config from "config";
import { getFileFields, answersHashMap } from "../helpers";
import PgBoss from "pg-boss";
import { PayMetadata } from "../../../types/FormDataBody";

type EmailArgs = {
  subject: string;
  body: string;
  attachments: FormField[];
  reference: string;
};

type PaymentViewModel = {
  id: string;
  status: string;
  url: string;
  allTransactionsByCountry: {
    url: string;
    country: string;
  };
};

export class SESService {
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

  async send(
    fields: FormField[],
    template: SESEmailTemplate,
    metadata: {
      reference: string;
      payment?: PayMetadata;
    }
  ) {
    const { reference, payment } = metadata;

    const emailArgs = await this.buildSendEmailArgs({ fields, payment }, template, reference);
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

  private getEmailBody(data: { fields: FormField[]; payment?: PaymentViewModel }, template: SESEmailTemplate) {
    if (template === "cni") {
      throw new ApplicationError("SES", "TEMPLATE_NOT_FOUND", 500, "CNI template has not been configured");
    }
    const { fields, payment } = data;

    return this.templates[template]({
      questions: fields,
      payment,
    });
  }

  private async buildSendEmailArgs(data: { fields: FormField[]; payment?: PayMetadata }, template: SESEmailTemplate, reference: string) {
    const { fields, payment } = data;
    const answers = answersHashMap(fields);
    let paymentViewModel: PaymentViewModel | undefined;

    try {
      paymentViewModel = this.paymentViewModel(payment, answers.country as string);
    } catch (e) {
      this.logger.warn(`Payment details for ${reference} could not be parsed. Payment details will not be shown on the email.`);
    }

    const emailBody = this.getEmailBody({ fields, payment: paymentViewModel }, template);
    const post = answers.post ?? additionalContexts[answers.country as string].post;
    return {
      subject: `${template} application, ${post} – ${reference}`,
      body: emailBody,
      attachments: getFileFields(fields),
      reference,
    };
  }

  paymentViewModel(payment: PayMetadata | undefined, country: string) {
    if (!payment) {
      return;
    }
    const paymentUrl = new URL(payment.payId, config.get<string>("Pay.accountTransactionsUrl"));
    const allTransactionsByCountryUrl = new URL(config.get<string>("Pay.accountTransactionsUrl"));
    allTransactionsByCountryUrl.searchParams.set("metadataValue", country);

    return {
      id: payment.payId,
      status: payment.state.status,
      url: paymentUrl.toString(),
      allTransactionsByCountry: {
        url: allTransactionsByCountryUrl.toString(),
        country,
      },
    };
  }

  private static createTemplate(template: string) {
    return handlebars.compile(template);
  }
}
