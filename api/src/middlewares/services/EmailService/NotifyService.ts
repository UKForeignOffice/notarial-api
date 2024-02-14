import config from "config";
import pino, { Logger } from "pino";
import { ApplicationError } from "../../../ApplicationError";
import * as additionalContexts from "./additionalContexts.json";
import { NotifyEmailTemplate, NotifyPersonalisation, NotifySendEmailArgs } from "./types";
import * as templates from "./templates";
import { AnswersHashMap } from "../../../types/AnswersHashMap";
import PgBoss from "pg-boss";
import { getPostEmailAddress } from "./utils/getPostEmailAddress";
import { templateBuilder } from "./TemplateService";
import { ref } from "joi";
import { PayMetadata } from "../../../types/FormDataBody";

const previousMarriageDocs = {
  Divorced: "decree absolute",
  "Dissolved civil partner": "final order",
  Widowed: "late partner's death certificate",
  "Surviving civil partner": "late partner's death certificate",
  Annulled: "decree of nullity",
};
export class NotifyService {
  logger: Logger;
  templates: Record<NotifyEmailTemplate, string>;
  queue?: PgBoss;
  QUEUE_NAME = "NOTIFY";
  queueOptions: {
    retryBackoff: boolean;
    retryLimit: number;
  };
  constructor() {
    this.logger = pino().child({ service: "Notify" });
    try {
      const userConfirmation = config.get<string>("Notify.Template.userConfirmation");
      const postNotification = config.get<string>("Notify.Template.postNotification");
      this.templates = {
        userConfirmation,
        postNotification,
      };
    } catch (err) {
      this.logger.error({ err }, "Notify templates have not been configured, exiting");
      process.exit(1);
    }

    try {
      const retryBackoff = config.get<string>("Notify.Retry.backoff") === "true";
      const retryLimit = parseInt(config.get<string>("Notify.Retry.limit"));
      this.queueOptions = {
        retryBackoff,
        retryLimit,
      };
      this.logger.info(`${this.QUEUE_NAME} jobs will retry with retryBackoff: ${retryBackoff}, retryLimit: ${retryLimit}`);
    } catch (err) {
      this.logger.error({ err }, "Retry options could not be set, exiting");
      process.exit(1);
    }

    const queue = new PgBoss({
      connectionString: config.get<string>("Queue.url"),
    });

    queue.start().then((pgboss) => {
      this.queue = pgboss;
      this.logger.info(`Sending messages to ${this.QUEUE_NAME}. Ensure that there is a handler listening to ${this.QUEUE_NAME}`);
    });
  }

  async sendEmailToUser(answers: AnswersHashMap, metadata: { reference: string; payment?: PayMetadata }) {
    const { reference, payment } = metadata;
    const personalisation = templateBuilder.userConfirmation(answers, metadata);
    const emailArgs = {
      template: this.templates.userConfirmation,
      emailAddress: answers.emailAddress as string,
      options: {
        personalisation,
        reference,
      },
    };
    return this.sendEmail(emailArgs, reference);
  }

  async sendEmail({ template, emailAddress, options }: NotifySendEmailArgs, reference: string) {
    const jobId = await this.queue?.send?.(
      this.QUEUE_NAME,
      {
        template,
        emailAddress,
        options,
      },
      this.queueOptions
    );
    if (!jobId) {
      throw new ApplicationError("NOTIFY", "QUEUE_ERROR", 500, `Sending ${template} to ${emailAddress} failed`);
    }
    this.logger.info({ reference, emailAddress, jobId }, `reference ${reference}, notify email queued with jobId ${jobId}`);
    return jobId;
  }

  async sendEmailToPost(answers: AnswersHashMap, reference: string) {
    const country = answers["country"] as string;
    const post = answers["post"] as string;
    const emailAddress = getPostEmailAddress(country, post);

    if (!emailAddress) {
      this.logger.warn(`No email address found for country ${country} - post ${post}`);
      return;
    }

    const jobId = await this.queue?.send?.(
      this.QUEUE_NAME,
      {
        template: this.templates.postNotification,
        emailAddress,
        options: {
          reference,
          personalisation: {
            post,
          },
        },
      },
      this.queueOptions
    );

    if (!jobId) {
      throw new ApplicationError("NOTIFY", "QUEUE_ERROR", 500, `Sending ${this.templates.postNotification} to ${emailAddress} failed`);
    }

    return jobId;
  }

  getPersonalisationForTemplate(answers: AnswersHashMap, reference: string, paid: boolean, template: NotifyPersonalisation) {
    const docsList = this.buildDocsList(answers, paid);
    const country = answers["country"] as string;
    const post = answers["post"] as string;

    const personalisationValues = {
      ...answers,
      docsList,
      paid,
      reference,
      ...(additionalContexts.countries[country] ?? {}),
      ...(additionalContexts.posts[post] ?? additionalContexts.countries[country].post ?? {}),
    };
    const toPersonalisation = this.mapPersonalisationValues(personalisationValues);
    return Object.entries(template).reduce(toPersonalisation, {} as NotifyPersonalisation);
  }

  mapPersonalisationValues(personalisationValues: Record<string, string | boolean>) {
    return function (acc: NotifyPersonalisation, [key, value]) {
      acc[key] = personalisationValues[key] ?? value;
      return acc;
    };
  }

  buildDocsList(fields: AnswersHashMap, paid: boolean) {
    const docsList = ["your UK passport", "proof of address", "your partner’s passport or national identity card"];
    if (fields.maritalStatus && fields.maritalStatus !== "Never married") {
      docsList.push(`your ${previousMarriageDocs[fields.maritalStatus as string]}`);
    }
    if (fields.oathType === "affidavit") {
      docsList.push("religious book of your faith to swear upon");
    }
    if (!paid) {
      const price = fields.certifyPassport ? "£75" : "£50";
      docsList.push(`the equivalent of ${price} in the local currency`);
    }
    const country = fields.country as string;
    const additionalDocs = additionalContexts[country]?.additionalDocs ?? [];
    docsList.push(...additionalDocs);
    return docsList.map((doc) => `* ${doc}`).join("\n");
  }
}
