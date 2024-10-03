import config from "config";
import pino, { Logger } from "pino";
import { QueueService } from "../QueueService";
import { FormType, PayMetadata } from "../../../types/FormDataBody";
import { NotifySendEmailArgs, NotifyTemplateGroup } from "../utils/types";
import { AnswersHashMap } from "../../../types/AnswersHashMap";
import { getUserTemplate } from "./getUserTemplate";
import { MARRIAGE_FORM_TYPES } from "../../../utils/formTypes";
import { getPersonalisationBuilder } from "./getPersonalisationBuilder";
import _ from "lodash";

export class UserService {
  logger: Logger;
  templates: NotifyTemplateGroup;
  queueService: QueueService;
  constructor({ queueService }: { queueService: QueueService }) {
    this.logger = pino().child({ service: "Notify" });
    this.queueService = queueService;
    try {
      this.templates = {
        affirmation: {
          inPerson: config.get<string>("Notify.Template.affirmationUserConfirmation"),
          postal: config.get<string>("Notify.Template.affirmationUserConfirmation"),
        },
        cni: {
          cni: {
            inPerson: config.get<string>("Notify.Template.cniUserConfirmation"),
            postal: config.get<string>("Notify.Template.cniUserPostalConfirmation"),
          },
          msc: {
            inPerson: config.get<string>("Notify.Template.mscUserConfirmation"),
            postal: config.get<string>("Notify.Template.mscUserConfirmation"),
          },
          cniAndMsc: {
            inPerson: config.get<string>("Notify.Template.cniMSCUserConfirmation"),
            postal: config.get<string>("Notify.Template.cniMSCUserConfirmation"),
          },
        },
        exchange: {
          inPerson: config.get<string>("Notify.Template.exchangeUserConfirmation"),
          postal: config.get<string>("Notify.Template.exchangeUserPostalConfirmation"),
        },
        certifyCopy: {
          adult: {
            inPerson: config.get<string>("Notify.Template.certifyCopyAdultUserConfirmation"),
            postal: config.get<string>("Notify.Template.certifyCopyAdultUserPostalConfirmation"),
          },
          child: {
            inPerson: config.get<string>("Notify.Template.certifyCopyChildUserConfirmation"),
            postal: config.get<string>("Notify.Template.certifyCopyChildUserPostalConfirmation"),
          },
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
  async sendToProcessQueue(answers: AnswersHashMap, metadata: { reference: string; payment?: PayMetadata; type: FormType; postal?: boolean }) {
    return await this.queueService.sendToQueue("NOTIFY_PROCESS", { answers, metadata });
  }

  async sendEmailToUser(data: { answers: AnswersHashMap; metadata: { reference: string; payment?: PayMetadata; type: FormType; postal?: boolean } }) {
    const { answers, metadata } = data;
    const { reference, type } = data.metadata;
    let isPostalApplication = metadata.postal;

    if (!MARRIAGE_FORM_TYPES.has(metadata.type)) {
      isPostalApplication = answers.applicationType === "postal";
    }

    const templateType = this.getTemplateType(answers, type);

    const templateName = getUserTemplate(answers.country as string, type, isPostalApplication);
    const personalisationBuilder = getPersonalisationBuilder(type);
    const buildPersonalisationForTemplate = personalisationBuilder[templateName];
    const personalisation = buildPersonalisationForTemplate(answers, metadata);
    const emailArgs = {
      template: _.get(this.templates, `${templateType}.${templateName}`),
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

  getTemplateType(answers: AnswersHashMap, type: FormType) {
    if (answers.service) {
      return `cni.${answers.service as FormType}`;
    }
    if (answers.over16 !== undefined) {
      return answers.over16 ? "certifyCopy.adult" : "certifyCopy.child";
    }
    return type;
  }
}
