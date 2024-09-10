import { Logger } from "pino";
import { AlertJob } from "../utils/types";
import { QueueService } from "../QueueService";
import { FormField } from "../../../types/FormField";
import { FormType, PayMetadata } from "../../../types/FormDataBody";
import { PaymentViewModel, ProcessQueueData, SESSendJob } from "./types";
import { AnswersHashMap } from "../../../types/AnswersHashMap";

export interface CaseService {
  logger: Logger;
  templates: {
    SES: HandlebarsTemplateDelegate;
    Notify: Record<"postAlert", string>;
  };

  queueService: QueueService;

  sendToProcessQueue(
    fields: FormField[],
    metadata: {
      reference: string;
      payment?: PayMetadata;
      type: FormType;
      postal?: boolean;
    }
  ): Promise<string>;

  sendEmail(data: ProcessQueueData): Promise<string>;

  /**
   * Builds the email body
   */
  getEmailBody(data: { fields: FormField[]; payment?: PaymentViewModel; reference: string }, type: FormType): string;

  /**
   * Parses the payment data in metadata
   * TODO:- refactor into own class or function
   */
  paymentViewModel(payment: PayMetadata | undefined, country: string): PaymentViewModel | undefined;

  /**
   * builds the data required for the SES_SEND job
   */
  buildJobData(data: ProcessQueueData): SESSendJob;

  /**
   * builds the data required for an onComplete handler.
   */
  getPostAlertData(answers: AnswersHashMap, reference: string): AlertJob | undefined;
}
