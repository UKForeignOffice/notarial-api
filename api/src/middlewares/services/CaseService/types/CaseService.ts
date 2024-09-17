import { AlertJob } from "../../utils/types";
import { QueueService } from "../../QueueService";
import { FormField } from "../../../../types/FormField";
import { FormType, PayMetadata } from "../../../../types/FormDataBody";
import { SESSendJob } from "./SESSendJob";
import { ProcessQueueData } from "./ProcessQueueData";
import { PaymentViewModel } from "./PaymentViewModel";
import { ProcessQueueDataInput } from "./ProcessQueueDataInput";

export interface CaseService {
  queueService: QueueService;

  sendToProcessQueue(data: ProcessQueueData): Promise<string>;

  sendEmail(data: ProcessQueueData): Promise<string>;

  /**
   * Builds the email body
   */
  getEmailBody(data: { fields: FormField[]; payment?: PaymentViewModel; reference: string }, type: FormType): string;

  /**
   * builds the data required for the SES_PROCESS job
   */
  buildProcessQueueData(input: ProcessQueueDataInput): ProcessQueueData;

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
  getPostAlertData(country: string, post: string, reference: string): AlertJob | undefined;
}
