import logger, { Logger } from "pino";
import { QueueService } from "../../QueueService";
import { FormType, PayMetadata } from "../../../../types/FormDataBody";
import config from "config";
import { getPostEmailAddress } from "../../utils/getPostEmailAddress";
import { PaymentViewModel, ProcessQueueData, ProcessQueueDataInput, SESSendJob } from "../types";
import { FormField } from "../../../../types/FormField";

export abstract class CaseService {
  logger: Logger;
  queueService: QueueService;
  templates: {
    SES: HandlebarsTemplateDelegate;
    Notify: Record<"postAlert", string>;
  };

  protected constructor({ queueService, templates }) {
    this.queueService = queueService;

    this.logger = logger().child({ service: "SES" });
    this.templates = templates;
  }

  abstract sendToProcessQueue(data: ProcessQueueData): Promise<string>;

  abstract sendEmail(data: ProcessQueueData): Promise<string>;

  /**
   * Builds the email body
   */
  abstract getEmailBody(data: { fields: FormField[]; payment?: PaymentViewModel; reference: string }, type: FormType): string;

  /**
   * builds the data required for the SES_PROCESS job
   */
  abstract buildProcessQueueData(input: ProcessQueueDataInput): ProcessQueueData;

  paymentViewModel(payment: PayMetadata | undefined, country: string) {
    if (!payment) {
      return;
    }
    const paymentUrl = new URL(payment.payId, config.get<string>("Pay.accountTransactionsUrl"));
    const allTransactionsByCountryUrl = new URL(config.get<string>("Pay.accountTransactionsUrl"));
    const total = payment.total ? (payment.total / 100).toFixed(2) : "Unpaid";
    allTransactionsByCountryUrl.searchParams.set("metadataValue", country);

    return {
      id: payment.payId,
      status: payment.state.status === "success" ? "success" : "cancelled or failed",
      url: paymentUrl.toString(),
      total,
      allTransactionsByCountry: {
        url: allTransactionsByCountryUrl.toString(),
        country,
      },
    };
  }

  /**
   * builds the data required for the SES_SEND job
   */
  abstract buildJobData(data: ProcessQueueData): SESSendJob;

  getPostAlertData(country: string, post: string, reference: string) {
    const emailAddress = getPostEmailAddress(post);
    if (!emailAddress) {
      this.logger.error(
        { code: "UNRECOGNISED_SERVICE_APPLICATION" },
        `No email address found for the specified post – ${country} - ${post} – reference ${reference}.`
      );
      return;
    }

    return {
      template: this.templates.Notify.postAlert,
      emailAddress,
      reference,
      options: {
        personalisation: {
          post,
          reference,
        },
        reference,
      },
    };
  }
}
