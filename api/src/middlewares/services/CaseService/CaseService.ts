import { Logger } from "pino";
import { AlertJob, SESEmailTemplate } from "../utils/types";
import { QueueService } from "../QueueService";
import { FormField } from "../../../types/FormField";
import { FormType, PayMetadata } from "../../../types/FormDataBody";
import { PaymentViewModel, ProcessQueueData, SESSendJob } from "./types";
import { AnswersHashMap } from "../../../types/AnswersHashMap";

export interface CaseService {
  logger: Logger;
  templates: {
    SES: Record<SESEmailTemplate, HandlebarsTemplateDelegate>;
    Notify: Record<"postAlert", string>;
  };

  queueService: QueueService;

  sendToProcessQueue(
    fields: FormField[],
    template: SESEmailTemplate,
    metadata: {
      reference: string;
      payment?: PayMetadata;
      type: FormType;
      postal?: boolean;
    }
  ): Promise<string>;

  sendEmail(data: ProcessQueueData): Promise<string>;

  getEmailBody(data: { fields: FormField[]; payment?: PaymentViewModel; reference: string }, template: SESEmailTemplate, type: FormType): string;

  paymentViewModel(payment: PayMetadata | undefined, country: string): PaymentViewModel | undefined;

  buildSendEmailArgs(data: ProcessQueueData): SESSendJob;

  getPostAlertOptions(answers: AnswersHashMap, reference: string): AlertJob | undefined;
}
