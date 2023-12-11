import { NotifyClient, RequestError, SendEmailResponse } from "notifications-node-client";
import config from "config";
import pino, { Logger } from "pino";
import { ApplicationError } from "../../../ApplicationError";
import { FormField } from "../../../types/FormField";
import * as additionalContexts from "./additionalContexts.json";
import { EmailServiceProvider, NotifySendEmailArgs } from "./types";
import * as templates from "./templates";

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

  async send(fields: Record<string, FormField>, template: string, reference: string) {
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

  buildSendEmailArgs(fields: Record<string, FormField>, template: string, reference: string): NotifySendEmailArgs {
    const defaultTemplate = templates.user[template];
    const personalisation = this.getPersonalisationForTemplate(fields, reference, fields.paid.answer as boolean, defaultTemplate);
    return {
      template: this.templates.standard,
      emailAddress: fields["emailAddress"].answer as string,
      options: {
        personalisation,
        reference: reference,
      },
    };
  }

  getPersonalisationForTemplate(fields: Record<string, FormField>, reference: string, paid: boolean, template: Record<string, string | boolean>) {
    const docsList = this.buildDocsList(fields, paid);
    const country = fields["country"].answer;
    const post = fields["post"]?.answer;
    const personalisationValues = {
      ...fields,
      docsList,
      paid,
      reference,
      ...additionalContexts[country as string],
      ...(additionalContexts[post as string] ?? {}),
    };
    return Object.keys(template).reduce((acc, curr) => {
      return {
        ...acc,
        [curr]: personalisationValues[curr]?.answer ?? personalisationValues[curr],
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

  buildDocsList(fields: Record<string, FormField>, paid: boolean) {
    let docsList = ["your UK passport", "proof of address", "your partner’s passport or national identity card"];
    if (fields.marriedBefore?.answer && fields.maritalStatus?.answer) {
      docsList.push(`your ${previousMarriageDocs[fields.maritalStatus.answer as string]}`);
    }
    if (fields.oathType.answer === "affidavit") {
      docsList.push("religious book of your faith to swear upon");
    }
    if (!paid) {
      docsList.push("the equivalent of £50 in the local currency");
    }
    if (additionalContexts[fields.country?.answer as string].additionalDocs) {
      docsList = docsList.concat(additionalContexts[fields.country?.answer as string].additionalDocs);
    }
    return docsList.map((doc) => `* ${doc}`).join("\n");
  }
}
