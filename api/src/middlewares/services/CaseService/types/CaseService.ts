import { AlertJob, TemplateType } from "../../utils/types";
import { QueueService } from "../../QueueService";
import { FormField } from "../../../../types/FormField";
import { SESSendJob } from "./SESSendJob";
import { ProcessQueueData } from "./ProcessQueueData";
import { PaymentData } from "./PaymentData";
import { ProcessQueueDataInput } from "./ProcessQueueDataInput";
import { Logger } from "pino";

export interface CaseService {
  logger: Logger;
  queueService: QueueService;

  sendToProcessQueue(data: ProcessQueueData): Promise<string>;

  sendEmail(data: ProcessQueueData): Promise<string>;

  /**
   * Builds the email body
   */
  getEmailBody(data: { fields: FormField[]; payment?: PaymentData; reference: string }, type: TemplateType): string;

  /**
   * builds the data required for the SES_PROCESS job
   */
  buildProcessQueueData(input: ProcessQueueDataInput): ProcessQueueData;

  /**
   * builds the data required for the SES_SEND job
   */
  buildJobData(data: ProcessQueueData): SESSendJob;

  /**
   * builds the data required for an onComplete handler.
   */
  getPostAlertData(country: string, post: string, reference: string): AlertJob | undefined;
}
