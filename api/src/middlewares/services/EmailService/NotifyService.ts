import { NotifyClient, RequestError } from "notifications-node-client";
import config from "config";
import pino, { Logger } from "pino";
import { ApplicationError } from "../../../ApplicationError";
import * as additionalContexts from "./additionalContexts.json";
import { EmailServiceProvider, isNotifyEmailTemplate, NotifyPersonalisation, NotifySendEmailArgs, NotifyEmailTemplate } from "./types";
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
  notify: NotifyClient;
  logger: Logger;
  templates: Record<NotifyEmailTemplate, string>;
  queue: PgBoss;
  constructor() {
    const apiKey = config.get("notifyApiKey");
    const userConfirmationTemplate = config.get<string>("notifyTemplateUserConfirmation");
    const postNotificationTemplate = config.get<string>("notifyTemplatePostNotification");
    if (!apiKey) {
      throw new ApplicationError("NOTIFY", "NO_API_KEY", 500);
    }
    if (!userConfirmationTemplate || !postNotificationTemplate) {
      throw new ApplicationError("NOTIFY", "NO_TEMPLATE", 500);
    }
    this.templates = {
      userConfirmation: userConfirmationTemplate,
      postNotification: postNotificationTemplate,
    };
    this.notify = new NotifyClient(apiKey as string);
    this.logger = pino().child({ service: "Notify" });

    this.queue = new PgBoss({
      connectionString: config.get<string>("Queue.url"),
    });
  }

  async send(fields: FormField[], template: string, reference: string) {
    if (!isNotifyEmailTemplate(template)) {
      throw new ApplicationError("NOTIFY", "TEMPLATE_NOT_FOUND", 400);
    }
    const emailArgs = this.buildSendEmailArgs(fields, template, reference);
    return this.sendEmail(emailArgs, reference);
  }

  async sendEmail({ template, emailAddress, options }: NotifySendEmailArgs, reference: string) {
    try {
      const jobId = await this.queue.send("notify", {
        data: {
          template,
          emailAddress,
          options,
        },
        options: {
          retryBackoff: true,
        },
      });
      this.logger.info({ reference, emailAddress, jobId }, `reference ${reference}, notify email queued with jobId ${jobId}`);
    } catch (e: any) {
      this.logger.error({ err: e, reference, emailAddress }, `Sending ${template} to ${emailAddress} failed`);
      throw new ApplicationError("NOTIFY", "QUEUE_ERROR", 500, e.message);
    }
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
    return Object.entries(template).reduce(toPersonalisation, template);
  }

  mapPersonalisationValues(personalisationValues: Record<string, string | boolean>) {
    return function (acc: NotifyPersonalisation, [key, value]) {
      acc[key] = personalisationValues[key] ?? value;
      return acc;
    };
  }

  handleError(error: any) {
    const { response = {} } = error;
    const isNotifyError = "data" in response && response.data.errors;
    if (isNotifyError) {
      const notifyErrors = response.data.errors as RequestError[];
      throw new ApplicationError("NOTIFY", "API_ERROR", 500, JSON.stringify(notifyErrors));
    }
    throw new ApplicationError("NOTIFY", "UNKNOWN", 500, error.message);
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
      // TODO:- update to reflect correct £.
      docsList.push("the equivalent of £50 in the local currency");
    }
    const country = fields.country as string;
    const additionalDocs = additionalContexts[country]?.additionalDocs ?? [];
    docsList.push(...additionalDocs);
    return docsList.map((doc) => `* ${doc}`).join("\n");
  }
}
