import { AlertJob } from "../../utils/types";
import { QueueService } from "../../QueueService";
import { FormField } from "../../../../types/FormField";
import { FormDataBody, FormType, PayMetadata } from "../../../../types/FormDataBody";
import { SESSendJob } from "./SESSendJob";
import { ProcessQueueData } from "./ProcessQueueData";
import { PaymentViewModel } from "./PaymentViewModel";
import { CaseServiceBaseType } from "./CaseServiceBase";

export interface CaseService extends CaseServiceBaseType {
  queueService: QueueService;

  sendToProcessQueue(data: ProcessQueueData): Promise<string>;

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
   * builds the data required for the SES_PROCESS job
   */
  buildProcessQueueData(fields: FormField[], reference: string, type: FormType, metadata: FormDataBody["metadata"]): ProcessQueueData;

  /**
   * builds the data required for the SES_SEND job
   */
  buildJobData(data: ProcessQueueData): SESSendJob;

  /**
   * builds the data required for an onComplete handler.
   */
  getPostAlertData(country: string, post: string, reference: string): AlertJob | undefined;
}
