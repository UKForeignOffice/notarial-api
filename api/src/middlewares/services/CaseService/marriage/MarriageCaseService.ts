import { FormField } from "../../../../types/FormField";
import marriageSubmissionTemplate from "./marriageSubmissionTemplate";
import { MarriageFormType } from "../../../../types/FormDataBody";
import { remappers } from "./remappers";
import { getAnswerOrThrow } from "../utils/getAnswerOrThrow";
import { reorderers } from "./reorderers";
import { getApplicationTypeName } from "../utils/getApplicationTypeName";
import { answersHashMap } from "../../helpers";
import config from "config";
import * as handlebars from "handlebars";
import { isFieldType } from "../../../../utils";
import { getPostForMarriage } from "../../utils/getPost";
import { MarriageProcessQueueData, PaymentData, CaseService } from "../types";
import { PaymentViewModel } from "../utils/PaymentViewModel";
import { MarriageProcessQueueDataInput } from "../types";
import { getPostEmailAddress } from "../../utils/getPostEmailAddress";
import logger, { Logger } from "pino";
import { QueueService } from "../../QueueService";

export class MarriageCaseService implements CaseService {
  logger: Logger;
  queueService: QueueService;
  templates: {
    SES: HandlebarsTemplateDelegate;
    Notify: Record<"postAlert", string>;
  };
  constructor({ queueService }) {
    this.queueService = queueService;
    this.templates = {
      SES: MarriageCaseService.createTemplate(marriageSubmissionTemplate),
      Notify: {
        postAlert: config.get<string>("Notify.Template.postNotification"),
      },
    };
    this.logger = logger().child({ service: "SES" });
  }

  buildProcessQueueData(input: MarriageProcessQueueDataInput): MarriageProcessQueueData {
    const { fields, reference, metadata, type } = input;
    return {
      fields,
      metadata: {
        reference,
        payment: metadata.pay,
        type: type,
        postal: metadata.postal,
      },
    };
  }

  /**
   * This will add all the parameters needed to process the email to the queue. The NOTIFY_PROCESS queue will pick up
   * this message and make a post request to notarial-api/forms/emails/staff
   */
  async sendToProcessQueue(data: MarriageProcessQueueData) {
    return await this.queueService.sendToQueue("SES_PROCESS", data);
  }

  async sendEmail(data: MarriageProcessQueueData) {
    const jobData = this.buildJobData(data);
    return await this.queueService.sendToQueue("SES_SEND", jobData);
  }

  getEmailBody(data: { fields: FormField[]; payment?: PaymentData; reference: string; postal?: boolean }, type: MarriageFormType) {
    const { fields, payment, reference, postal } = data;
    const remapperName = postal ? `${type}Postal` : type;

    const remapFields = remappers[remapperName];
    const remapped = remapFields(fields);

    const { information } = remapped;

    const reorderer = reorderers[remapperName];
    const reordered = reorderer(remapped);

    const country = getAnswerOrThrow(information, "country");
    const post = getPostForMarriage(country, information.post?.answer);
    let oathType, jurats;
    if ((type === "affirmation" || type === "cni") && !postal) {
      oathType = getAnswerOrThrow(information, "oathType");
      jurats = getAnswerOrThrow(information, "jurats");
    }
    return this.templates.SES({
      post,
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

  buildJobData(data: MarriageProcessQueueData) {
    const { fields, metadata } = data;
    const { reference, payment, type, postal } = metadata;
    const answers = answersHashMap(fields);
    let paymentViewModel: PaymentData | undefined;

    try {
      paymentViewModel = PaymentViewModel(payment, answers.country as string);
    } catch (e) {
      this.logger.warn(`Payment details for ${reference} could not be parsed. Payment details will not be shown on the email.`);
    }

    const country = answers.country as string;
    const emailBody = this.getEmailBody({ fields, payment: paymentViewModel, reference, postal }, type);
    const post = getPostForMarriage(country, answers.post as string);
    const onCompleteJob = this.getPostAlertData(country, post, reference);
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

  private static createTemplate(template: string) {
    return handlebars.compile(template);
  }
}
