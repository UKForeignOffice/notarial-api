import config from "config";
import pino, { Logger } from "pino";
import { PersonalisationBuilder } from "./personalisation/PersonalisationBuilder";
import { QueueService } from "../QueueService";
import { FormType, PayMetadata } from "../../../types/FormDataBody";
import { NotifySendEmailArgs, NotifyTemplateGroup } from "../utils/types";
import { AnswersHashMap } from "../../../types/AnswersHashMap";
import { getUserTemplate } from "./getUserTemplate";

export class UserService {
  logger: Logger;
  templates: Record<FormType, NotifyTemplateGroup>;
  queueService: QueueService;
  constructor({ queueService }: { queueService: QueueService }) {
    this.logger = pino().child({ service: "Notify" });
    this.queueService = queueService;
    try {
      const postNotification = config.get<string>("Notify.Template.postNotification");
      this.templates = {
        affirmation: {
          userConfirmation: config.get<string>("Notify.Template.affirmationUserConfirmation"),
          userPostalConfirmation: config.get<string>("Notify.Template.affirmationUserConfirmation"),
          postNotification,
        },
        cni: {
          userConfirmation: config.get<string>("Notify.Template.cniUserConfirmation"),
          userPostalConfirmation: config.get<string>("Notify.Template.cniUserPostalConfirmation"),
          postNotification,
        },
        exchange: {
          userConfirmation: config.get<string>("Notify.Template.exchangeUserConfirmation"),
          userPostalConfirmation: config.get<string>("Notify.Template.exchangeUserPostalConfirmation"),
          postNotification,
        },
      };
    } catch (err) {
      this.logger.error({ err }, "Notify templates have not been configured, exiting");
      process.exit(1);
    }
  }

  /**
   * Stores the user's answers in the queue for processing.
   */
  async sendToProcessQueue(answers: AnswersHashMap, metadata: { reference: string; payment?: PayMetadata; type: FormType }) {
    return await this.queueService.sendToQueue("NOTIFY_PROCESS", { answers, metadata });
  }

  async sendEmailToUser(data: { answers: AnswersHashMap; metadata: { reference: string; payment?: PayMetadata; type: FormType; postal?: boolean } }) {
    const { answers, metadata } = data;
    const { reference, type } = data.metadata;

    const templateName = getUserTemplate(answers.country as string, metadata.postal);
    const personalisation = PersonalisationBuilder[templateName](answers, metadata);
    const emailArgs = {
      template: this.templates[type][templateName],
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
