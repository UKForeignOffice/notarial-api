import { FormField } from "../../../../types/FormField";
import requestDocumentSubmissionTemplate from "./requestDocumentSubmissionTemplate";
import { answersHashMap } from "../../helpers";
import config from "config";
import * as handlebars from "handlebars";
import { isFieldType } from "../../../../utils";
import { getPostForRequestDocument } from "../../utils/getPost";
import { CertifyCopyProcessQueueData, PaymentData } from "../types";
import { PaymentViewModel } from "../utils/PaymentViewModel";
import { CaseService } from "../types";
import { reorderSectionsWithNewName } from "../utils/reorderSectionsWithNewName";
import { order, remap } from "./mappings";
import { createRemapper } from "../utils/createRemapper";
import { CertifyCopyProcessQueueDataInput } from "../types";
import { getPostEmailAddress } from "../../utils/getPostEmailAddress";
import { QueueService } from "../../QueueService";
import logger, { Logger } from "pino";
import { RequestDocumentAnswersHashmap } from "../../../../types/AnswersHashMap";

export class RequestDocumentCaseService implements CaseService {
  logger: Logger;
  queueService: QueueService;
  templates: {
    SES: HandlebarsTemplateDelegate;
    Notify: Record<"postAlert", string>;
  };

  constructor({ queueService }) {
    this.queueService = queueService;
    this.templates = {
      SES: RequestDocumentCaseService.createTemplate(requestDocumentSubmissionTemplate),
      Notify: {
        postAlert: config.get<string>("Notify.Template.requestDocumentPostNotification"),
      },
    };
    this.logger = logger().child({ service: "SES" });
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

  async sendToProcessQueue(data: CertifyCopyProcessQueueData) {
    return await this.queueService.sendToQueue("SES_PROCESS", data);
  }

  async sendEmail(data: CertifyCopyProcessQueueData) {
    const jobData = this.buildJobData(data);
    return await this.queueService.sendToQueue("SES_SEND", jobData);
  }

  getEmailBody(data: { fields: FormField[]; payment?: PaymentData; reference: string }) {
    const { fields, payment, reference } = data;

    const remapFields = createRemapper(remap);
    const remapped = remapFields(fields);
    const { country, serviceType } = remapped;

    const reorderer = reorderSectionsWithNewName(order);
    const reordered = reorderer(remapped);

    const post = getPostForRequestDocument(serviceType.answer, country?.answer, remapped.post?.answer);

    return this.templates.SES({
      post,
      reference,
      payment,
      serviceType: serviceType.answer,
      country: country?.answer,
      questions: reordered,
    });
  }

  buildJobData(data: CertifyCopyProcessQueueData) {
    const { fields, metadata } = data;
    const { reference, payment, type } = metadata;
    const answers = answersHashMap(fields) as RequestDocumentAnswersHashmap;
    let paymentViewModel: PaymentData | undefined;

    try {
      paymentViewModel = PaymentViewModel(payment, answers.serviceType);
    } catch (e) {
      this.logger.warn(`Payment details for ${reference} could not be parsed. Payment details will not be shown on the email.`);
    }

    const emailBody = this.getEmailBody({ fields, payment: paymentViewModel, reference });
    const post = getPostForRequestDocument(answers.serviceType, answers.applicationCountry, answers.post);

    const onCompleteJob = this.getPostAlertData(post, reference);
    return {
      subject: `Prepare a document application, ${answers.serviceType}, ${post} – ${reference}`,
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

  getPostAlertData(post: string, reference: string) {
    const emailAddress = getPostEmailAddress(post);
    if (!emailAddress) {
      this.logger.error({ code: "UNRECOGNISED_SERVICE_APPLICATION" }, `No email address found for the specified post – ${post} – reference ${reference}.`);
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
