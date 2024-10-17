import { UserTemplateGroup } from "./UserTemplateGroup";
import { RequestDocumentAnswersHashmap } from "../../../../types/AnswersHashMap";
import { getPersonalisationBuilder } from "../getPersonalisationBuilder";
import config from "config";
import { requestDocumentPersonalisationBuilder } from "../personalisation/PersonalisationBuilder/requestDocument";

export class RequestDocumentUserTemplates implements UserTemplateGroup {
  templates: {
    "USA - J1 visa no objection statement": string;
    "Democratic Republic of the Congo - consular certificate": string;
    appointment: string;
    courier: string;
    posted: string;
  };

  constructor() {
    this.templates = {
      "USA - J1 visa no objection statement": config.get<string>("Notify.Template.requestDocument.J1"),
      "Democratic Republic of the Congo - consular certificate": config.get<string>("Notify.Template.requestDocument.appointment"),
      appointment: config.get<string>("Notify.Template.requestDocument.appointment"),
      courier: config.get<string>("Notify.Template.requestDocument.courier"),
      posted: config.get<string>("Notify.Template.requestDocument.posted"),
    };
  }

  getTemplate(data) {
    const answers = data.answers as RequestDocumentAnswersHashmap;
    const requestDocAnswers = answers as RequestDocumentAnswersHashmap;
    const documentType = requestDocAnswers.serviceType;

    let template;

    if (documentType === "No objection certificate to adopt a child") {
      const country = requestDocAnswers.applicationCountry;
      const adoptionTemplateName = this.getAdoptionTemplateName(country!);
      template = this.templates[adoptionTemplateName];
    }

    template ??= this.templates[documentType];

    return { personalisationBuilder: requestDocumentPersonalisationBuilder, template };
  }

  getAdoptionTemplateName(country: string) {
    const countryMap: { [key: string]: GenericRequestDocumentTemplates } = {
      India: "courier",
      Vietnam: "appointment",
      Spain: "posted",
      "United Arab Emirates": "appointment",
      Thailand: "posted",
    };

    return countryMap[country];
  }
}
type GenericRequestDocumentTemplates = "courier" | "appointment" | "posted";
