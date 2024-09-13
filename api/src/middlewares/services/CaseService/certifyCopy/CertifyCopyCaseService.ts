import logger, { Logger } from "pino";
import { QueueService } from "../../QueueService";
import { FormField } from "../../../../types/FormField";
import * as templates from "./../templates";
import { PayMetadata } from "../../../../types/FormDataBody";
import { getAnswerOrThrow } from "../utils/getAnswerOrThrow";
import { answersHashMap } from "../../helpers";
import { AnswersHashMap } from "../../../../types/AnswersHashMap";
import config from "config";
import * as handlebars from "handlebars";
import { isFieldType } from "../../../../utils";
import { getPost } from "../../utils/getPost";
import { getPostEmailAddress } from "../../utils/getPostEmailAddress";
import { CertifyCopyFormMetadata, CertifyCopyProcessQueueData, PaymentViewModel, ProcessQueueData } from "../types";
import { CaseService } from "../CaseService";
import { reorderSectionsWithNewName } from "../utils/reorderSectionsWithNewName";
import { order, remap } from "./mappings";
import { createRemapper } from "../utils/createRemapper";

export class CertifyCopyCaseService implements CaseService {
  logger: Logger;
  templates: {
    SES: HandlebarsTemplateDelegate;
    Notify: Record<"postAlert", string>;
  };

  queueService: QueueService;

  constructor({ queueService }) {
    this.queueService = queueService;
    this.logger = logger().child({ service: "SES" });
    this.templates = {
      SES: CertifyCopyCaseService.createTemplate(templates.certifyCopySubmission),
      Notify: {
        postAlert: config.get<string>("Notify.Template.certifyCopyPostNotification"),
      },
    };
  }

  /**
   * This will add all the parameters needed to process the email to the queue. The NOTIFY_PROCESS queue will pick up
   * this message and make a post request to notarial-api/forms/emails/staff
   */
  async sendToProcessQueue(fields: FormField[], metadata: CertifyCopyFormMetadata) {
    return await this.queueService.sendToQueue("SES_PROCESS", { fields, metadata });
  }

  async sendEmail(data: ProcessQueueData) {
    const jobData = this.buildJobData(data);
    return await this.queueService.sendToQueue("SES_SEND", jobData);
  }

  getEmailBody(data: { fields: FormField[]; payment?: PaymentViewModel; reference: string }) {
    const { fields, payment, reference } = data;

    const remapFields = createRemapper(remap);
    const remapped = remapFields(fields);

    const { information } = remapped;

    const reorderer = reorderSectionsWithNewName(order);
    const reordered = reorderer(remapped);

    const country = getAnswerOrThrow(information, "country");
    const post = getPost(country, information.post?.answer);
    return this.templates.SES({
      post,
      reference,
      payment,
      country,
      certifyPassport: information.certifyPassport?.answer ?? false,
      questions: reordered,
    });
  }

  buildJobData(data: CertifyCopyProcessQueueData) {
    const { fields, metadata } = data;
    const { reference, payment, type } = metadata;
    const answers = answersHashMap(fields);
    let paymentViewModel: PaymentViewModel | undefined;

    try {
      paymentViewModel = this.paymentViewModel(payment, answers.country as string);
    } catch (e) {
      this.logger.warn(`Payment details for ${reference} could not be parsed. Payment details will not be shown on the email.`);
    }

    const country = answers.country as string;
    const emailBody = this.getEmailBody({ fields, payment: paymentViewModel, reference });
    const post = getPost(country, answers.post as string);
    const onCompleteJob = this.getPostAlertData(answers, reference);
    return {
      subject: `Local marriage application - ${post} – ${reference}`,
      body: emailBody,
      attachments: fields.filter(isFieldType("file")),
      reference,
      metadata: {
        reference,
        type,
      },
      onComplete: {
        queue: "NOTIFY_SEND",
        ...(onCompleteJob && { job: onCompleteJob }),
      },
    };
  }

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

  getPostAlertData(answers: AnswersHashMap, reference: string) {
    const country = answers["country"] as string;
    const post = getPost(country, answers["post"] as string);
    const emailAddress = getPostEmailAddress(country, post);
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

  private static createTemplate(template: string) {
    return handlebars.compile(template);
  }
}
