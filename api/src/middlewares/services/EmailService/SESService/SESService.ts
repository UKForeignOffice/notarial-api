import logger, { Logger } from "pino";
import * as handlebars from "handlebars";
import { ApplicationError } from "../../../../ApplicationError";
import { FormField } from "../../../../types/FormField";
import * as templates from "./templates";
import { SESEmailTemplate } from "../types";
import config from "config";
import { answersHashMap } from "../../helpers";
import PgBoss from "pg-boss";
import { FormType, PayMetadata } from "../../../../types/FormDataBody";
import { remappers } from "./remappers";
import { reorderers } from "./reorderers";
import { getPost } from "../utils/getPost";
import { getApplicationTypeName } from "./utils/getApplicationTypeName";
import { isFieldType } from "../../../../utils";
import { NotifyService } from "../NotifyService";
import { getAnswerOrThrow } from "./utils/getAnswerOrThrow";

type EmailArgs = {
  subject: string;
  body: string;
  attachments: FormField[];
  reference: string;
  onComplete?: ReturnType<NotifyService["getPostAlertOptions"]>;
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
  QUEUE_NAME = "SES_SEND";
  PROCESS_QUEUE_NAME = "SES_PROCESS";
  queueOptions: {
    retryBackoff: boolean;
    retryLimit: number;
  };

  constructor() {
    this.logger = logger().child({ service: "SES" });
    this.templates = {
      submission: SESService.createTemplate(templates.submission),
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
      this.logger.info(
        `Sending messages to ${this.QUEUE_NAME} or ${this.PROCESS_QUEUE_NAME}. Ensure that there is a handler listening to ${this.QUEUE_NAME} and ${this.PROCESS_QUEUE_NAME}`
      );
    });
  }

  async sendToParseQueue(
    fields: FormField[],
    template: SESEmailTemplate,
    metadata: {
      reference: string;
      payment?: PayMetadata;
      type: FormType;
      postAlertOptions: ReturnType<NotifyService["getPostAlertOptions"]>;
    }
  ) {
    const jobId = await this.queue?.send?.(this.PROCESS_QUEUE_NAME, { fields, template, metadata }, this.queueOptions);
    if (!jobId) {
      throw new ApplicationError("SES", "QUEUE_ERROR", 500, `Queueing failed for ${metadata.reference}`);
    }
    return jobId;
  }

  async send(data: {
    fields: FormField[];
    template: SESEmailTemplate;
    metadata: {
      reference: string;
      payment?: PayMetadata;
      type: FormType;
      postAlertOptions: ReturnType<NotifyService["getPostAlertOptions"]>;
    };
  }) {
    const { fields, template, metadata } = data;
    const { reference, payment, type, postAlertOptions } = metadata;
    const emailArgs = this.buildSendEmailArgs({ fields, payment }, template, reference, type, postAlertOptions);
    return this.sendEmail(emailArgs, reference);
  }

  /**
   * @throws ApplicationError
   */
  async sendEmail(emailArgs: EmailArgs, reference: string) {
    const jobId = await this.queue?.send?.(this.QUEUE_NAME, emailArgs, this.queueOptions);
    if (!jobId) {
      throw new ApplicationError("SES", "QUEUE_ERROR", 500, `Queueing failed for ${reference}`);
    }
    this.logger.info({ reference, jobId }, `reference ${reference}, SES queued with jobId ${jobId}`);
    return jobId;
  }

  getEmailBody(data: { fields: FormField[]; payment?: PaymentViewModel; reference: string }, template: SESEmailTemplate, type: FormType) {
    const { fields, payment, reference } = data;
    const remapped = remappers.affirmation(fields);

    const { information } = remapped;

    const reordered = reorderers.affirmation(remapped);
    const country = getAnswerOrThrow(information, "country");
    const post = information.post?.answer;
    return this.templates[template]({
      post: getPost(country, post),
      type: getApplicationTypeName(type),
      reference,
      payment,
      country,
      oathType: getAnswerOrThrow(information, "oathType"),
      jurats: getAnswerOrThrow(information, "jurats"),
      certifyPassport: information.certifyPassport?.answer ?? false,
      questions: reordered,
    });
  }

  private buildSendEmailArgs(
    data: { fields: FormField[]; payment?: PayMetadata },
    template: SESEmailTemplate,
    reference: string,
    type: FormType,
    postAlertOptions: ReturnType<NotifyService["getPostAlertOptions"]>
  ) {
    const { fields, payment } = data;
    const answers = answersHashMap(fields);
    let paymentViewModel: PaymentViewModel | undefined;

    try {
      paymentViewModel = this.paymentViewModel(payment, answers.country as string);
    } catch (e) {
      this.logger.warn(`Payment details for ${reference} could not be parsed. Payment details will not be shown on the email.`);
    }

    const country = answers.country as string;
    const emailBody = this.getEmailBody({ fields, payment: paymentViewModel, reference }, template, type);
    const post = getPost(country, answers.post as string);
    return {
      subject: `${type} application, ${post} – ${reference}`,
      body: emailBody,
      attachments: fields.filter(isFieldType("file")),
      reference,
      postAlertOptions,
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
      status: payment.state.status === "success" ? "success" : "cancelled or failed",
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
