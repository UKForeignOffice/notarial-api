import { QueueService } from "../../QueueService";
import { FormField } from "../../../../types/FormField";
import * as templates from "./../templates";
import { MarriageFormType } from "../../../../types/FormDataBody";
import { remappers } from "./remappers";
import { getAnswerOrThrow } from "../utils/getAnswerOrThrow";
import { reorderers } from "./reorderers";
import { getApplicationTypeName } from "../utils/getApplicationTypeName";
import { answersHashMap } from "../../helpers";
import config from "config";
import * as handlebars from "handlebars";
import { isFieldType } from "../../../../utils";
import { getPost } from "../../utils/getPost";
import { MarriageProcessQueueData, PaymentViewModel } from "../types";
import { CaseService } from "../types";
import { CaseServiceBase } from "../utils/CaseServiceBase";
import { MarriageProcessQueueDataInput } from "../types";

export class MarriageCaseService extends CaseServiceBase implements CaseService {
  queueService: QueueService;

  constructor({ queueService }) {
    super(MarriageCaseService.createTemplate(templates.marriageSubmission), config.get<string>("Notify.Template.postNotification"));
    this.queueService = queueService;
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

  getEmailBody(data: { fields: FormField[]; payment?: PaymentViewModel; reference: string; postal?: boolean }, type: MarriageFormType) {
    const { fields, payment, reference, postal } = data;
    const remapperName = postal ? `${type}Postal` : type;

    const remapFields = remappers[remapperName];
    const remapped = remapFields(fields);

    const { information } = remapped;

    const reorderer = reorderers[remapperName];
    const reordered = reorderer(remapped);

    const country = getAnswerOrThrow(information, "country");
    const post = getPost(country, information.post?.answer);
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
    let paymentViewModel: PaymentViewModel | undefined;

    try {
      paymentViewModel = this.paymentViewModel(payment, answers.country as string);
    } catch (e) {
      this.logger.warn(`Payment details for ${reference} could not be parsed. Payment details will not be shown on the email.`);
    }

    const country = answers.country as string;
    const emailBody = this.getEmailBody({ fields, payment: paymentViewModel, reference, postal }, type);
    const post = getPost(country, type, answers.post as string);
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

  private static createTemplate(template: string) {
    return handlebars.compile(template);
  }
}
