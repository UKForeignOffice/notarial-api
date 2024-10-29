import { FormField } from "../../../../types/FormField";
import consularLetterSubmissionTemplate from "./consularLetterSubmissionTemplate";
import config from "config";
import * as handlebars from "handlebars";
import { isFieldType } from "../../../../utils";
import { ConsularLetterProcessQueueData, PaymentData } from "../types";
import { PaymentViewModel } from "../utils/PaymentViewModel";
import { CaseService } from "../types";
import { reorderSectionsWithNewName } from "../utils/reorderSectionsWithNewName";
import { order, remap } from "./mappings";
import { createRemapper } from "../utils/createRemapper";
import { ConsularLetterProcessQueueDataInput } from "../types";
import { getPostEmailAddress } from "../../utils/getPostEmailAddress";
import { QueueService } from "../../QueueService";
import logger, { Logger } from "pino";

export class ConsularLetterCaseService implements CaseService {
  logger: Logger;
  queueService: QueueService;
  templates: {
    SES: HandlebarsTemplateDelegate;
    Notify: Record<"postAlert", string>;
  };

  constructor({ queueService }) {
    this.queueService = queueService;
    this.templates = {
      SES: ConsularLetterCaseService.createTemplate(consularLetterSubmissionTemplate),
      Notify: {
        postAlert: config.get<string>("Notify.Template.consularLetterPostNotification"),
      },
    };
    this.logger = logger().child({ service: "SES" });
  }

  buildProcessQueueData(input: ConsularLetterProcessQueueDataInput): ConsularLetterProcessQueueData {
    const { fields, reference, metadata, type } = input;
    return {
      fields,
      metadata: {
        reference,
        payment: metadata.pay,
        type,
      },
    };
  }

  /**
   * This will add all the parameters needed to process the email to the queue. The NOTIFY_PROCESS queue will pick up
   * this message and make a post request to notarial-api/forms/emails/staff
   */
  async sendToProcessQueue(data: ConsularLetterProcessQueueData) {
    return await this.queueService.sendToQueue("SES_PROCESS", data);
  }

  async sendEmail(data: ConsularLetterProcessQueueData) {
    const jobData = this.buildJobData(data);
    return await this.queueService.sendToQueue("SES_SEND", jobData);
  }

  getEmailBody(data: { fields: FormField[]; payment?: PaymentData; reference: string }) {
    const { fields, reference } = data;

    const remapFields = createRemapper(remap);
    const remapped = remapFields(fields);

    const reorderer = reorderSectionsWithNewName(order);
    const reordered = reorderer(remapped);

    const post = "the British Embassy Bangkok";
    const applicantIsNok = remapped.information.applicantIsNextOfKin;
    return this.templates.SES({
      post,
      applicantIsNok,
      reference,
      questions: reordered,
    });
  }

  buildJobData(data: ConsularLetterProcessQueueData) {
    const { fields, metadata } = data;
    const { reference, payment, type } = metadata;
    let paymentViewModel: PaymentData | undefined;
    const country = "Thailand";

    try {
      paymentViewModel = PaymentViewModel(payment, country);
    } catch (e) {
      this.logger.warn(`Payment details for ${reference} could not be parsed. Payment details will not be shown on the email.`);
    }

    const emailBody = this.getEmailBody({ fields, payment: paymentViewModel, reference });
    const post = "the British Embassy Bangkok";
    const onCompleteJob = this.getPostAlertData(country, post, reference);
    return {
      subject: `Letter to release a body application, ${country}, ${post} – ${reference}`,
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
