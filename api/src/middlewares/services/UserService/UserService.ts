import pino, { Logger } from "pino";
import { QueueService } from "../QueueService";
import { FormType, PayMetadata } from "../../../types/FormDataBody";
import { NotifySendEmailArgs } from "../utils/types";
import { AnswersHashMap } from "../../../types/AnswersHashMap";

import { UserTemplates } from "./NotifyTemplates";

export class UserService {
  logger: Logger;
  queueService: QueueService;
  templates: UserTemplates;
  constructor({ queueService }: { queueService: QueueService }) {
    this.logger = pino().child({ service: "Notify" });
    this.queueService = queueService;
    this.templates = new UserTemplates();
  }

  /**
   * Stores the user's answers in the queue for processing.
   */
  async sendToProcessQueue(answers: AnswersHashMap, metadata: { reference: string; payment?: PayMetadata; type: FormType; postal?: boolean }) {
    return await this.queueService.sendToQueue("NOTIFY_PROCESS", { answers, metadata });
  }

  async sendEmailToUser(data: { answers: AnswersHashMap; metadata: { reference: string; payment?: PayMetadata; type: FormType; postal?: boolean } }) {
    const { answers, metadata } = data;
    const { reference } = metadata;

    const { template, personalisationBuilder } = this.templates.getTemplate(data);
    const personalisation = personalisationBuilder(answers, metadata);

    const emailArgs = {
      template,
      emailAddress: answers.emailAddress as string,
      metadata: {
        reference,
      },
      options: {
        personalisation,
        reference,
      },
    };
    return this.sendEmail(emailArgs);
  }

  async sendEmail(notifySendEmailArgs: NotifySendEmailArgs) {
    return await this.queueService.sendToQueue("NOTIFY_SEND", notifySendEmailArgs);
  }
}
