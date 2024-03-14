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
import { AnswersHashMap } from "../../../../types/AnswersHashMap";
import { getPostEmailAddress } from "../utils/getPostEmailAddress";
import { PersonalisationBuilder } from "../NotifyService/personalisation/PersonalisationBuilder";

type EmailArgs = {
  subject: string;
  body: string;
  attachments: FormField[];
  reference: string;
  onComplete?: {
    queue: string;
    job: ReturnType<NotifyService["getPostAlertOptions"]>;
  };
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

type ProcessQueueData = {
  fields: FormField[];
  template: SESEmailTemplate;
  metadata: {
    reference: string;
    payment?: PayMetadata;
    type: FormType;
  };
};
export class StaffService {
  logger: Logger;
  templates: {
    SES: Record<SESEmailTemplate, HandlebarsTemplateDelegate>;
    Notify: Record<"postAlert", string>;
  };
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
      SES: {
        submission: StaffService.createTemplate(templates.submission),
      },
      Notify: {
        postAlert: config.get<string>("Notify.Template.postNotification"),
      },
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

  /**
   * This will add all the parameters needed to process the email to the queue. The NOTIFY_PROCESS queue will pick up
   * this message and make a post request to notarial-api/forms/emails/staff
   */
  async sendToProcessQueue(
    fields: FormField[],
    template: SESEmailTemplate,
    metadata: {
      reference: string;
      payment?: PayMetadata;
      type: FormType;
    }
  ) {
    const jobId = await this.queue?.send?.(this.PROCESS_QUEUE_NAME, { fields, template, metadata }, this.queueOptions);
    if (!jobId) {
      throw new ApplicationError("SES", "QUEUE_ERROR", 500, `Queueing failed for ${metadata.reference}`);
    }
    return jobId;
  }

  async sendEmail(data: ProcessQueueData) {
    const emailArgs = this.buildSendEmailArgs(data);
    return this.sendToSendQueue(emailArgs, emailArgs.reference);
  }

  /**
   * @throws ApplicationError
   */
  async sendToSendQueue(emailArgs: EmailArgs, reference: string) {
    const jobId = await this.queue?.send?.(this.QUEUE_NAME, emailArgs, { ...this.queueOptions, onComplete: true });
    if (!jobId) {
      throw new ApplicationError("SES", "QUEUE_ERROR", 500, `Queueing ${this.QUEUE_NAME} failed for ${reference}`);
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
    return this.templates.SES[template]({
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

  private buildSendEmailArgs(data: ProcessQueueData) {
    const { fields, template, metadata } = data;
    const { reference, payment, type } = metadata;
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
      onComplete: {
        queue: "NOTIFY_SEND",
        job: this.getPostAlertOptions(answers, type, reference),
      },
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

  getPostAlertOptions(answers: AnswersHashMap, type: FormType, reference: string) {
    const country = answers["country"] as string;
    const post = answers["post"] as string;
    const emailAddress = getPostEmailAddress(country, post);
    const personalisation = PersonalisationBuilder.postNotification(answers, type);
    if (!emailAddress) {
      this.logger.warn(`No email address found for country ${country} - post ${post}. Post notification will not be sent`);
      return;
    }

    return {
      template: this.templates.Notify.postAlert,
      emailAddress,
      reference,
      options: {
        personalisation,
        reference,
      },
    };
  }

  private static createTemplate(template: string) {
    return handlebars.compile(template);
  }
}
