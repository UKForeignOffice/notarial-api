import { NotifyClient, RequestError, SendEmailResponse } from "notifications-node-client";
import config from "config";
import pino, { Logger } from "pino";
import { ApplicationError } from "../../../ApplicationError";
import * as additionalContexts from "./additionalContexts.json";
import { EmailServiceProvider, NotifySendEmailArgs } from "./types";
import * as templates from "./templates";
import { FormField } from "../../../types/FormField";
import { answersHashMap } from "../helpers";
import { AnswersHashMap } from "../../../types/AnswersHashMap";

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
  templates: Record<string, string>;
  constructor() {
    const apiKey = config.get("notifyApiKey");
    const standardTemplate = config.get("notifyTemplateStandard");
    if (!apiKey) {
      throw new ApplicationError("NOTIFY", "NO_API_KEY", 500);
    }
    if (!standardTemplate) {
      throw new ApplicationError("NOTIFY", "NO_TEMPLATE", 500);
    }
    this.templates = {
      standard: standardTemplate as string,
    };
    this.notify = new NotifyClient(apiKey as string);
    this.logger = pino().child({ service: "Notify" });
  }

  async send(fields: FormField[], template: string, reference: string) {
    const emailArgs = this.buildSendEmailArgs(fields, template, reference);
    return this.sendEmail(emailArgs, reference);
  }

  async sendEmail({ template, emailAddress, options }: NotifySendEmailArgs, reference: string) {
    try {
      const response = await this.notify.sendEmail(template, emailAddress, options);
      this.logger.info(`Reference ${reference} user email sent successfully with Notify id: ${(response.data as SendEmailResponse).id}`);
      return response.data as SendEmailResponse;
    } catch (e) {
      this.handleError(e);
    }
    throw new ApplicationError("NOTIFY", "API_ERROR", 500, "No data was returned from the api");
  }

  buildSendEmailArgs(fields: FormField[], template: string, reference: string): NotifySendEmailArgs {
    const answers = answersHashMap(fields);
    const defaultTemplate = templates.user[template];
    const personalisation = this.getPersonalisationForTemplate(answers, reference, answers.paid as boolean, defaultTemplate);
    return {
      template: this.templates.standard,
      emailAddress: answers.emailAddress as string,
      options: {
        personalisation,
        reference: reference,
      },
    };
  }

  getPersonalisationForTemplate(answers: AnswersHashMap, reference: string, paid: boolean, template: Record<string, string | boolean>) {
    const docsList = this.buildDocsList(answers, paid);
    const country = answers["country"];
    const post = answers["post"];
    const personalisationValues = {
      ...answers,
      docsList,
      paid,
      reference,
      ...(additionalContexts[country as string] ?? {}),
      ...(additionalContexts[post as string] ?? {}),
    };
    return Object.keys(template).reduce((acc, curr) => {
      return {
        ...acc,
        [curr]: personalisationValues[curr],
      };
    }, {});
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
    if (fields.maritalStatus) {
      docsList.push(`your ${previousMarriageDocs[fields.maritalStatus as string]}`);
    }
    if (fields.oathType === "affidavit") {
      docsList.push("religious book of your faith to swear upon");
    }
    if (!paid) {
      docsList.push("the equivalent of £50 in the local currency");
    }
    const country = fields.country as string;
    const additionalDocs = additionalContexts[country]?.additionalDocs ?? [];
    docsList.push(...additionalDocs);
    return docsList.map((doc) => `* ${doc}`).join("\n");
  }
}
