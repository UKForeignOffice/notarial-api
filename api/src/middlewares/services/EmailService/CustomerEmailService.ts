import { EmailService } from "./EmailService";
import { FormField } from "../../../types/FormField";
import { fieldsHashMap } from "./helpers";
import * as additionalContexts from "./additionalContexts.json";
import * as templates from "./templates";
import config from "config";
import { ApplicationError } from "../../../ApplicationError";
import { NotifyMailModel, NotifyService } from "./NotifyService";

const previousMarriageDocs = {
  Divorced: "decree absolute",
  "Dissolved civil partner": "final order",
  Widowed: "late partner's death certificate",
  "Surviving civil partner": "late partner's death certificate",
  Annulled: "decree of nullity",
};
export class CustomerEmailService extends EmailService {
  templateIds: {
    standard: string;
  };

  declare provider: NotifyService;
  constructor({ notifyService }) {
    super("NOTIFY", notifyService);
    if (!config.get("notifyTemplateStandard")) {
      throw new ApplicationError("NOTIFY", "NO_TEMPLATE", 500);
    }
    this.templateIds = {
      standard: config.get("notifyTemplateStandard"),
    };
  }

  buildEmail(formData: FormField[], reference: string, paid: boolean): NotifyMailModel {
    const defaultTemplate = templates.user.standard;
    const fields = fieldsHashMap(formData);
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
    const personalisation = Object.keys(defaultTemplate).reduce((acc, curr) => {
      return {
        ...acc,
        [curr]: personalisationValues[curr]?.answer ?? personalisationValues[curr],
      };
    }, {});
    return {
      template: this.templateIds.standard,
      emailAddress: personalisationValues["applicantEmail"].answer,
      options: {
        personalisation,
        reference: reference,
      },
    };
  }
  sendEmail(params: NotifyMailModel) {
    return this.provider.send(params);
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
