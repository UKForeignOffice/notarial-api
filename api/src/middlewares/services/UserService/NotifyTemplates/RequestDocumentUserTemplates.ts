import { UserTemplateGroup } from "./UserTemplateGroup";
import { RequestDocumentAnswersHashmap } from "../../../../types/AnswersHashMap";
import config from "config";
import { requestDocumentPersonalisationBuilder } from "../personalisation/PersonalisationBuilder/requestDocument";

export class RequestDocumentUserTemplates implements UserTemplateGroup {
  templates: Record<RequestDocumentDocumentTemplateKeys, string>;

  constructor() {
    this.templates = {
      "USA - J1 visa no objection statement": config.get<string>("Notify.Template.requestDocument.J1"),
      "Democratic Republic of the Congo - consular certificate": config.get<string>("Notify.Template.requestDocument.appointment"),
      "Vietnam - letter to support a permanent residency application": config.get<string>("Notify.Template.requestDocument.vietnamResidency"),
      "Panama - certificate of entitlement for a Panamanian driving licence": config.get<string>("Notify.Template.requestDocument.panamaDrivingLicence"),
      "India - letter to access Indian state or national archives": config.get<string>("Notify.Template.requestDocument.indiaArchives"),
      "India - organ transplant letter": config.get<string>("Notify.Template.requestDocument.indiaOrganTransplant"),
      "India - letter of introduction for admission to an Indian university": config.get<string>("Notify.Template.requestDocument.indiaUniversity"),
      "Thailand - letter supporting Thai citizenship": config.get<string>("Notify.Template.requestDocument.thailandCitizenship"),
      "Luxembourg - certificate of custom law": config.get<string>("Notify.Template.requestDocument.certificateOfCustomLaw"),
      "Belgium - certificate of custom law": config.get<string>("Notify.Template.requestDocument.certificateOfCustomLaw"),
      "Andorra - MSC": config.get<string>("Notify.Template.requestDocument.andorraMSC"),
      "Mexico - criminal record certificate letter": config.get<string>("Notify.Template.requestDocument.mexicoCriminalRecord"),
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
type RequestDocumentServiceTypes =
  | "USA - J1 visa no objection statement"
  | "Democratic Republic of the Congo - consular certificate"
  | "Vietnam - letter to support a permanent residency application"
  | "Panama - certificate of entitlement for a Panamanian driving licence"
  | "India - letter to access Indian state or national archives"
  | "India - organ transplant letter"
  | "India - letter of introduction for admission to an Indian university"
  | "Thailand - letter supporting Thai citizenship"
  | "Luxembourg - certificate of custom law"
  | "Belgium - certificate of custom law"
  | "Andorra - MSC"
  | "Mexico - criminal record certificate letter";
type RequestDocumentDocumentTemplateKeys = GenericRequestDocumentTemplates | RequestDocumentServiceTypes;
