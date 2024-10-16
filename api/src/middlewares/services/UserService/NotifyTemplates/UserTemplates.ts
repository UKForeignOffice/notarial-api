import config from "config";
import { AnswersHashMap } from "../../../../types/AnswersHashMap";
import { FormType, MarriageFormType, PayMetadata } from "../../../../types/FormDataBody";
import { MARRIAGE_FORM_TYPES } from "../../../../utils/formTypes";
import { getPersonalisationBuilder } from "../getPersonalisationBuilder";
import * as additionalContexts from "../../utils/additionalContexts.json";

export class UserTemplates {
  templates = {
    affirmation: {
      inPerson: config.get<string>("Notify.Template.affirmationUserConfirmation"),
      postal: config.get<string>("Notify.Template.affirmationUserConfirmation"),
    },
    cni: {
      cni: {
        inPerson: config.get<string>("Notify.Template.cniUserConfirmation"),
        postal: config.get<string>("Notify.Template.cniUserPostalConfirmation"),
      },
      msc: {
        inPerson: config.get<string>("Notify.Template.mscUserConfirmation"),
        postal: config.get<string>("Notify.Template.mscUserConfirmation"),
      },
      cniAndMsc: {
        inPerson: config.get<string>("Notify.Template.cniMSCUserConfirmation"),
        postal: config.get<string>("Notify.Template.cniMSCUserConfirmation"),
      },
    },
    exchange: {
      inPerson: config.get<string>("Notify.Template.exchangeUserConfirmation"),
      postal: config.get<string>("Notify.Template.exchangeUserPostalConfirmation"),
    },
    certifyCopy: {
      adult: {
        inPerson: config.get<string>("Notify.Template.certifyCopyAdultUserConfirmation"),
        postal: config.get<string>("Notify.Template.certifyCopyAdultUserPostalConfirmation"),
      },
      child: {
        inPerson: config.get<string>("Notify.Template.certifyCopyChildUserConfirmation"),
        postal: config.get<string>("Notify.Template.certifyCopyChildUserPostalConfirmation"),
      },
    },
    requestDocument: {},
  };
  constructor() {
    try {
    } catch (e) {
      console.error("Notify templates have not been configured, exiting", e);
      process.exit(1);
    }
  }

  getTemplate(data: { answers: AnswersHashMap; metadata: { reference: string; payment?: PayMetadata; type: FormType; postal?: boolean } }) {
    const { answers, metadata } = data;
    const { type } = data.metadata;

    let isPostalApplication = metadata.postal;

    if (!MARRIAGE_FORM_TYPES.has(metadata.type)) {
      isPostalApplication = answers.applicationType === "postal";
    }

    const postalVariant = this.getPostalVariant(answers, isPostalApplication, type);
    let template;

    if (type === "cni") {
      const serviceSubtype = (answers.service ?? "cni") as MarriageFormType;
      template = this.templates.cni[serviceSubtype][postalVariant];
    }

    if (answers.over16 !== undefined) {
      const certifyCopyVariant = answers.over16 ? "adult" : "child";
      template ??= this.templates.certifyCopy[certifyCopyVariant][postalVariant];
    }

    template ??= this.templates[type][postalVariant];

    const personalisationBuilder = getPersonalisationBuilder(type);
    const builder = personalisationBuilder[postalVariant];

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
