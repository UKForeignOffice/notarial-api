import config from "config";
import pino, { Logger } from "pino";
import { ApplicationError } from "../../../ApplicationError";
import * as additionalContexts from "./additionalContexts.json";
import { EmailServiceProvider, NotifyPersonalisation, NotifySendEmailArgs, NotifyEmailTemplate } from "./types";
import * as templates from "./templates";
import { FormField } from "../../../types/FormField";
import { answersHashMap } from "../helpers";
import { AnswersHashMap } from "../../../types/AnswersHashMap";
import PgBoss from "pg-boss";

const previousMarriageDocs = {
  Divorced: "decree absolute",
  "Dissolved civil partner": "final order",
  Widowed: "late partner's death certificate",
  "Surviving civil partner": "late partner's death certificate",
  Annulled: "decree of nullity",
};
export class NotifyService implements EmailServiceProvider {
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

  async send(fields: FormField[], template: NotifyEmailTemplate, reference: string) {
    const emailArgs = this.buildSendEmailArgs(fields, template, reference);
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
      {
        retryBackoff: true,
      }
    );
    if (!jobId) {
      throw new ApplicationError("NOTIFY", "QUEUE_ERROR", 500, `Sending ${template} to ${emailAddress} failed`);
    }
    this.logger.info({ reference, emailAddress, jobId }, `reference ${reference}, notify email queued with jobId ${jobId}`);
    return jobId;
  }

  buildSendEmailArgs(fields: FormField[], template: NotifyEmailTemplate, reference: string): NotifySendEmailArgs {
    const answers = answersHashMap(fields);
    const defaultTemplate = templates.notify[template];
    const personalisation = this.getPersonalisationForTemplate(answers, reference, answers.paid as boolean, defaultTemplate);
    return {
      template: this.templates.userConfirmation,
      emailAddress: answers.emailAddress as string,
      options: {
        personalisation,
        reference: reference,
      },
    };
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
      ...(additionalContexts[country] ?? {}),
      ...(additionalContexts[post] ?? {}),
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
