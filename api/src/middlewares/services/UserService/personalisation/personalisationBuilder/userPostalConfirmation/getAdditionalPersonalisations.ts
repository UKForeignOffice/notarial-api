import { AnswersHashMap } from "../../../../../../types/AnswersHashMap";
import { FormType } from "../../../../../../types/FormDataBody";

type PersonalisationFunction = (fields: AnswersHashMap) => Record<string, boolean>;

export const personalisationTypeMap: Record<FormType, PersonalisationFunction> = {
  affirmation: (_fields: AnswersHashMap) => ({}),
  cni: getCNIPersonalisations,
  exchange: (_fields: AnswersHashMap) => ({}),
  msc: getMSCPersonalisations,
  cniAndMsc: getCNIAndMSCPersonalisations,
  certifyDocument: (_fields: AnswersHashMap) => ({}),
};

function getCNIPersonalisations(fields: AnswersHashMap) {
  const country = fields.country;
  const partnerHadPreviousMarriage = fields.partnerMaritalStatus !== "Never married";
  const livesOutsideApplicationCountry = fields.livesInCountry === false;
  return {
    countryIsItalyAndPartnerHadPreviousMarriage: country === "Italy" && partnerHadPreviousMarriage,
    countryIsItalyAndDoesNotLiveInItaly: country === "Italy" && livesOutsideApplicationCountry,
    countryIsCroatia: country === "Croatia",
  };
}

function getMSCPersonalisations(_fields: AnswersHashMap) {
  return {};
}

function getCNIAndMSCPersonalisations(fields: AnswersHashMap) {
  const livesInCountry = fields.livesInCountry === true;
  const livesOutsideApplicationCountry = fields.livesInCountry === false;
  return {
    livesInCountry,
    livesOutsideApplicationCountry,
  };
}
