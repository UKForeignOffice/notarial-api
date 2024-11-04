import { UserTemplateGroup } from "./UserTemplateGroup";
import { PostalVariant } from "../../utils/types";
import config from "config";
import { CertifyCopyAnswersHashmap } from "../../../../types/AnswersHashMap";
import { CertifyCopyPersonalisationBuilder } from "../personalisation/PersonalisationBuilder/certifyCopy/PersonalisationBuilder";

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
    const isPostalApplication = answers.applicationType === "postal";
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
