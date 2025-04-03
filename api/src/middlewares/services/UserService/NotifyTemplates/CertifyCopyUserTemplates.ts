import { UserTemplateGroup } from "./UserTemplateGroup";
import { PostalVariant } from "../../utils/types";
import config from "config";
import { CertifyCopyAnswersHashmap } from "../../../../types/AnswersHashMap";
import { CertifyCopyPersonalisationBuilder } from "../personalisation/PersonalisationBuilder/certifyCopy/PersonalisationBuilder";
import * as additionalContexts from "../../utils/additionalContexts.json";

export class CertifyCopyUserTemplates implements UserTemplateGroup {
  templates: {
    adult: Record<PostalVariant, string>;
    child: Record<PostalVariant, string>;
  };
  constructor() {
    this.templates = {
      adult: {
        inPerson: config.get<string>("Notify.Template.certifyCopyAdultUserConfirmation"),
        postal: config.get<string>("Notify.Template.certifyCopyAdultUserPostalConfirmation"),
      },
      child: {
        inPerson: config.get<string>("Notify.Template.certifyCopyChildUserConfirmation"),
        postal: config.get<string>("Notify.Template.certifyCopyChildUserPostalConfirmation"),
      },
    };
  }

   getTemplate(data) {
      const answers = data.answers as CertifyCopyAnswersHashmap;
      const country = answers["country"] as string;
      const postal = additionalContexts?.certifyCopy?.countries[country]?.postal;
      let isPostalApplication: boolean;
      if (postal === "TRUE") {
        isPostalApplication = true;
      } else if (postal === "FALSE") {
        isPostalApplication = false;
      } else if (postal === "HYBRID") {
        isPostalApplication = answers.applicationType === "postal";
      } else {
        isPostalApplication = false;
      }
      const postalVariant: PostalVariant = isPostalApplication ? "postal" : "inPerson";
      const isAdult = answers.over18 || false;
      const userTypeVariant = isAdult ? "adult" : "child";
      const personalisationBuilder = CertifyCopyPersonalisationBuilder[postalVariant];

      return {
        template: this.templates[userTypeVariant][postalVariant],
        personalisationBuilder,
      };
    }
}
