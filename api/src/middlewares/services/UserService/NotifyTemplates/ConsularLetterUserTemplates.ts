import { UserTemplateGroup } from "./UserTemplateGroup";
import { PostalVariant } from "../../utils/types";
import config from "config";
import { ConsularLetterAnswersHashmap } from "../../../../types/AnswersHashMap";
import { CertifyCopyPersonalisationBuilder } from "../personalisation/PersonalisationBuilder/certifyCopy/PersonalisationBuilder";

export class ConsularLetterUserTemplates implements UserTemplateGroup {
  templates: Record<PostalVariant, string>;
  constructor() {
    this.templates = {
      inPerson: config.get<string>("Notify.Template.consularLetterUserConfirmation"),
      postal: config.get<string>("Notify.Template.consularLetterUserPostalConfirmation"),
    };
  }

  getTemplate(data) {
    const answers = data.answers as ConsularLetterAnswersHashmap;
    const isPostalApplication = answers.letterChoice === "Post";
    const postalVariant: PostalVariant = isPostalApplication ? "postal" : "inPerson";
    const personalisationBuilder = CertifyCopyPersonalisationBuilder[postalVariant];

    return {
      template: this.templates[postalVariant],
      personalisationBuilder,
    };
  }
}
