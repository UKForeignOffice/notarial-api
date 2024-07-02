import logger, { Logger } from "pino";
import { QueueService } from "../QueueService";
import { FormField } from "../../../types/FormField";
import * as templates from "./templates";
import { FormType, PayMetadata } from "../../../types/FormDataBody";
import { remappers } from "./remappers";
import { getAnswerOrThrow } from "./utils/getAnswerOrThrow";
import { reorderers } from "./reorderers";
import { getApplicationTypeName } from "./utils/getApplicationTypeName";
import { answersHashMap } from "../helpers";
import { AnswersHashMap } from "../../../types/AnswersHashMap";
import config from "config";
import * as handlebars from "handlebars";
import { isFieldType } from "../../../utils";
import { getPost } from "../utils/getPost";
import { getPostEmailAddress } from "../utils/getPostEmailAddress";
import { PersonalisationBuilder } from "../UserService/personalisation/PersonalisationBuilder";
import { SESEmailTemplate } from "../utils/types";
import { ApplicationError } from "../../../ApplicationError";

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
    postal?: boolean;
  };
};
export class StaffService {
  logger: Logger;
  templates: {
    SES: Record<SESEmailTemplate, HandlebarsTemplateDelegate>;
    Notify: Record<"postAlert", string>;
  };

  queueService: QueueService;

  constructor({ queueService }) {
    this.queueService = queueService;
    this.logger = logger().child({ service: "SES" });
    this.templates = {
      SES: {
        submission: StaffService.createTemplate(templates.submission),
      },
      Notify: {
        postAlert: config.get<string>("Notify.Template.postNotification"),
      },
    };
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
      postal?: boolean;
    }
  ) {
    return await this.queueService.sendToQueue("SES_PROCESS", { fields, template, metadata });
  }

  async sendEmail(data: ProcessQueueData) {
    const emailArgs = this.buildSendEmailArgs(data);
    return await this.queueService.sendToQueue("SES_SEND", emailArgs);
  }

  getEmailBody(data: { fields: FormField[]; payment?: PaymentViewModel; reference: string; postal?: boolean }, template: SESEmailTemplate, type: FormType) {
    const { fields, payment, reference, postal } = data;
    const remapperName = postal ? `${type}Postal` : type;

    const remapFields = remappers[remapperName];
    const remapped = remapFields(fields);

    const { information } = remapped;

    const reorderer = reorderers[remapperName];
    const reordered = reorderer(remapped);

    const country = getAnswerOrThrow(information, "country");
    const post = getPost(country, information.post);
    let oathType, jurats;
    if ((type === "affirmation" || type === "cni") && !postal) {
      oathType = getAnswerOrThrow(information, "oathType");
      jurats = getAnswerOrThrow(information, "jurats");
    }
    return this.templates.SES[template]({
      post: getPost(country, post),
      type: getApplicationTypeName(type),
      reference,
      payment,
      country,
      oathType,
      jurats,
      certifyPassport: information.certifyPassport?.answer ?? false,
      questions: reordered,
    });
  }

  private buildSendEmailArgs(data: ProcessQueueData) {
    const { fields, template, metadata } = data;
    const { reference, payment, type, postal } = metadata;
    const answers = answersHashMap(fields);
    let paymentViewModel: PaymentViewModel | undefined;

    try {
      paymentViewModel = this.paymentViewModel(payment, answers.country as string);
    } catch (e) {
      this.logger.warn(`Payment details for ${reference} could not be parsed. Payment details will not be shown on the email.`);
    }

    const country = answers.country as string;
    const emailBody = this.getEmailBody({ fields, payment: paymentViewModel, reference, postal }, template, type);
    const post = getPost(country, answers.post as string);
    const onCompleteJob = this.getPostAlertOptions(answers, type, reference);
    return {
      subject: `Local marriage application - ${post} – ${reference}`,
      body: emailBody,
      attachments: fields.filter(isFieldType("file")),
      reference,
      metadata: {
        reference,
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
      this.logger.error(
        new ApplicationError(
          "GENERIC",
          "UNRECOGNISED_SERVICE_APPLICATION",
          400,
          "The currently selected post does not have an associated email address. This indicates the current country should not be using this service."
        )
      );
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
