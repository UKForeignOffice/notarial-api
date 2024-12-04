import { AlertJob, TemplateType } from "../../utils/types";
import { QueueService } from "../../QueueService";
import { FormField } from "../../../../types/FormField";
import { SESSendJob } from "./SESSendJob";
import { ProcessQueueData } from "./ProcessQueueData";
import { PaymentData } from "./PaymentData";
import { ProcessQueueDataInput } from "./ProcessQueueDataInput";
import { Logger } from "pino";

export type CaseService = OrbitCaseService | SESCaseService;

export interface OrbitCaseService {
  logger: Logger;
  queueService: QueueService;

  send(data): Promise<string>;
}

export interface SESCaseService {
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
