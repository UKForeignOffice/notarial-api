import config from "config";
import { AnswersHashMap } from "../../../../types/AnswersHashMap";
import { FormType, MarriageFormType, PayMetadata } from "../../../../types/FormDataBody";
import { getPersonalisationBuilder } from "../getPersonalisationBuilder";
import * as additionalContexts from "../../utils/additionalContexts.json";
import { CNISubGroup, PostalVariant } from "../../utils/types";
import { UserTemplateGroup } from "./UserTemplateGroup";

export class MarriageUserTemplates implements UserTemplateGroup {
  templates: {
    affirmation: {
      simplified: Record<PostalVariant, string>;
      legacy: Record<PostalVariant, string>;
    };
    exchange: Record<PostalVariant, string>;
    cni: Record<CNISubGroup, Record<PostalVariant, string>>;
  };
  constructor() {
    this.templates = {
      affirmation: {
        simplified: {
          inPerson: config.get<string>("Notify.Template.affirmationUserConfirmationSimplified"),
          postal: config.get<string>("Notify.Template.affirmationUserConfirmationSimplified"),
        },
        legacy: {
          inPerson: config.get<string>("Notify.Template.affirmationUserConfirmation"),
          postal: config.get<string>("Notify.Template.affirmationUserConfirmation"),
        },
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
    };
  }

  getTemplate(data: { answers: AnswersHashMap; metadata: { reference: string; payment?: PayMetadata; type: FormType; postal?: boolean; source?: string } }) {
    const { answers, metadata } = data;
    const { type } = data.metadata;

    let isPostalApplication = metadata.postal;

    const postalVariant = this.getPostalVariant(answers, isPostalApplication, type);
    let template, builder;

    if (type === "cni") {
      const serviceSubtype = (answers.service ?? "cni") as MarriageFormType;
      template = this.templates.cni[serviceSubtype][postalVariant];
    } else if (type === "affirmation") {
      const isSimplified = metadata.source === "simplified-marriage-v1";
      template = this.templates.affirmation[isSimplified ? "simplified" : "legacy"][postalVariant];
    } else {
      template = this.templates.exchange[postalVariant];
    }

    const personalisationBuilder = getPersonalisationBuilder(type);

    builder = personalisationBuilder[postalVariant];

    // Only the simplified affirmation template uses a `duration` placeholder.
    // Wrap the shared builder to append it without affecting other templates.
    if (type === "affirmation" && metadata.source === "simplified-marriage-v1") {
      const baseBuilder = builder;
      builder = (answers: AnswersHashMap, meta: { reference: string; payment?: PayMetadata; type?: FormType }) => {
        const personalisation = baseBuilder(answers, meta);
        const country = answers.country as string;
        const countryContext = additionalContexts.marriage.countries[country];
        const hasPreviousNameByDeedPoll = this.hasSimplifiedPreviousNameStatus(answers.nameChangedByDeedPoll);
        const hasPreviousNameByMarriage = this.hasSimplifiedPreviousNameStatus(answers.nameChangedByMarriage);
        const isCivilPartnership = answers.isCivilPartnership === true;
        return {
          ...personalisation,
          duration: countryContext?.duration || "3 months",
          previousNames: hasPreviousNameByDeedPoll || hasPreviousNameByMarriage,
          ceremonyType: isCivilPartnership ? "civil partnership" : "marriage",
          registrationType: isCivilPartnership ? "civil partnerships" : "marriages",
        };
      };
    }

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

  private hasSimplifiedPreviousNameStatus(value: string | boolean | undefined) {
    if (typeof value !== "string") {
      return false;
    }

    const normalised = value.trim().toLowerCase();
    return (
      normalised === "once" ||
      normalised === "name changed more than once" ||
      normalised === "yesmorethanonce"
    );
  }
}
