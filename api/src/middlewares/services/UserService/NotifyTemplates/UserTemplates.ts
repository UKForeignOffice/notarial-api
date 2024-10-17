import config from "config";
import { AnswersHashMap, RequestDocumentAnswersHashmap } from "../../../../types/AnswersHashMap";
import { FormType, MarriageFormType, PayMetadata } from "../../../../types/FormDataBody";
import { MARRIAGE_FORM_TYPES } from "../../../../utils/formTypes";
import { getPersonalisationBuilder } from "../getPersonalisationBuilder";
import * as additionalContexts from "../../utils/additionalContexts.json";
import { MarriageUserTemplates } from "./MarriageUserTemplates";
import { CertifyCopyUserTemplates } from "./CertifyCopyUserTemplates";

export class UserTemplates {
  marriage: MarriageUserTemplates;
  certifyCopy: CertifyCopyUserTemplates;
  templates = {
    certifyCopy: {},
    requestDocument: {
      "USA - J1 visa no objection statement": config.get<string>("Notify.Template.requestDocument.J1"),
      "Democratic Republic of the Congo - consular certificate": config.get<string>("Notify.Template.requestDocument.appointment"),
      appointment: config.get<string>("Notify.Template.requestDocument.appointment"),
      courier: config.get<string>("Notify.Template.requestDocument.courier"),
      posted: config.get<string>("Notify.Template.requestDocument.posted"),
    },
  };
  constructor() {
    try {
      this.marriage = new MarriageUserTemplates();
      this.certifyCopy = new CertifyCopyUserTemplates();
    } catch (e) {
      console.error("Notify templates have not been configured, exiting", e);
      process.exit(1);
    }
  }

  getTemplate(data: { answers: AnswersHashMap; metadata: { reference: string; payment?: PayMetadata; type: FormType; postal?: boolean } }) {
    const { answers, metadata } = data;
    const { type } = data.metadata;

    if (MARRIAGE_FORM_TYPES.has(metadata.type)) {
      return this.marriage.getTemplate(data);
    }

    if (metadata.type === "certifyCopy") {
      return this.certifyCopy.getTemplate(data);
    }

    let isPostalApplication = metadata.postal;

    const postalVariant = this.getPostalVariant(answers, isPostalApplication, type);
    let template, builder;

    if (type === "requestDocument") {
      const requestDocAnswers = answers as RequestDocumentAnswersHashmap;
      const documentType = requestDocAnswers.serviceType;

      if (documentType === "No objection certificate to adopt a child") {
        const country = requestDocAnswers.applicationCountry;
        const adoptionTemplateName = getAdoptionTemplateName(country!);
        template = this.templates.requestDocument[adoptionTemplateName];
      }

      template ??= this.templates.requestDocument[documentType];

      builder = getPersonalisationBuilder(type);
    }

    template ??= this.templates[type][postalVariant];

    const personalisationBuilder = getPersonalisationBuilder(type);

    builder ??= personalisationBuilder[postalVariant];

    return {
      template,
      personalisationBuilder: builder,
    };
  }

  getPostalVariant(answers: AnswersHashMap, postal: boolean | undefined, type: FormType) {
    const country = answers.country as string;
    // for exchange forms, any country that offers a postal journey and cni delivery should be a postal application.
    const countryOffersPostalRoute = additionalContexts.marriage.countries[country]?.postal && additionalContexts.marriage.countries[country]?.cniDelivery;
    // Croatia is an exception to this, and only offers in-person applications for exchange
    const countryIsCroatia = country === "Croatia";

    const postalSupport = postal ?? (type === "exchange" && countryOffersPostalRoute && !countryIsCroatia);

    return postalSupport ? "postal" : "inPerson";
  }
}

type GenericRequestDocumentTemplates = "courier" | "appointment" | "posted";
function getAdoptionTemplateName(country: string) {
  const countryMap: { [key: string]: GenericRequestDocumentTemplates } = {
    India: "courier",
    Vietnam: "appointment",
    Spain: "posted",
    "United Arab Emirates": "appointment",
    Thailand: "posted",
  };

  return countryMap[country];
}
