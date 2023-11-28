import { NotifyClient } from "notifications-node-client";
import config from "config";
import pino, { Logger } from "pino";
import { ApplicationError } from "../../../ApplicationError";
import { FormField } from "../../../types/FormField";
import { NotifyMailModel, UserTemplate } from "./EmailService";
import { fieldsHashMap } from "./helpers";
import * as additionalContexts from "./additionalContexts.json";

const previousMarriageDocs = {
  Divorced: "decree absolute",
  "Dissolved civil partner": "final order",
  Widowed: "late partner's death certificate",
  "Surviving civil partner": "late partner's death certificate",
  Annulled: "decree of nullity",
};

export class NotifyService {
  notify: NotifyClient;
  logger: Logger;
  templates = {};
  constructor() {
    this.logger = pino().child({ service: "Notify" });
    const apiKey = config.get("notifyApiKey");
    if (!apiKey) {
      throw new ApplicationError("NOTIFY", "NO_API_KEY", 500);
    }
    this.notify = new NotifyClient(apiKey as string);
  }

  buildEmail(formData: FormField[], template: UserTemplate) {}

  sendEmail({ template, emailAddress, options }: NotifyMailModel) {
    return this.notify.sendEmail(template, emailAddress, options);
  }

  buildDocsList(formData: FormField[], payRef: string) {
    const fields = fieldsHashMap(formData);
    let docsList = ["your UK passport", "proof of address", "your partner’s passport or national identity card"];
    if (fields.marriedBefore?.answer && fields.maritalStatus?.answer) {
      docsList.push(`your ${previousMarriageDocs[fields.maritalStatus.answer as string]}`);
    }
    if (fields.oathType.answer === "affidavit") {
      docsList.push("religious book of your faith to swear upon");
    }
    if (!payRef) {
      docsList.push("the equivalent of £50 in the local currency");
    }
    if (additionalContexts[fields.country?.answer as string].additionalDocs) {
      docsList = docsList.concat(additionalContexts[fields.country?.answer as string].additionalDocs);
    }
    return docsList.map((doc) => `* ${doc}`).join("\n");
  }
}
