import { QueueService } from "../../QueueService";
import { FormField } from "../../../../types/FormField";
import * as templates from "./../templates";
import { getAnswerOrThrow } from "../utils/getAnswerOrThrow";
import { answersHashMap } from "../../helpers";
import config from "config";
import * as handlebars from "handlebars";
import { isFieldType } from "../../../../utils";
import { getPostForCertifyCopy } from "../../utils/getPost";
import { CertifyCopyProcessQueueData, PaymentViewModel } from "../types";
import { CaseService } from "../types";
import { reorderSectionsWithNewName } from "../utils/reorderSectionsWithNewName";
import { order, remap } from "./mappings";
import { createRemapper } from "../utils/createRemapper";
import { CaseServiceBase } from "../utils/CaseServiceBase";
import { CertifyCopyProcessQueueDataInput } from "../types";

export class CertifyCopyCaseService extends CaseServiceBase implements CaseService {
  queueService: QueueService;

  constructor({ queueService }) {
    super(CertifyCopyCaseService.createTemplate(templates.certifyCopySubmission), config.get<string>("Notify.Template.certifyCopyPostNotification"));
    this.queueService = queueService;
  }

  buildProcessQueueData(input: CertifyCopyProcessQueueDataInput): CertifyCopyProcessQueueData {
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
  async sendToProcessQueue(data: CertifyCopyProcessQueueData) {
    return await this.queueService.sendToQueue("SES_PROCESS", data);
  }

  async sendEmail(data: CertifyCopyProcessQueueData) {
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
    const post = getPostForCertifyCopy(country, information.post?.answer);
    return this.templates.SES({
      post,
      reference,
      payment,
      country,
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
    const post = getPostForCertifyCopy(country, answers.post as string);
    const onCompleteJob = this.getPostAlertData(country, post, reference);
    return {
      subject: `Certify a copy of a passport application - ${post} – ${reference}`,
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
