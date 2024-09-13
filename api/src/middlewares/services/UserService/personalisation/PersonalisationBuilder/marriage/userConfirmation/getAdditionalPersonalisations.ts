import { AnswersHashMap } from "../../../../../../../types/AnswersHashMap";
import { MarriageFormType } from "../../../../../../../types/FormDataBody";

type PersonalisationFunction = (fields: AnswersHashMap) => Record<string, boolean>;

export const personalisationTypeMap: Record<MarriageFormType, PersonalisationFunction> = {
  affirmation: getAffirmationPersonalisations,
  cni: getCNIPersonalisations,
  exchange: getExchangePersonalisations,
  msc: (_fields: AnswersHashMap) => ({}),
  cniAndMsc: (_fields: AnswersHashMap) => ({}),
};

export function getAffirmationPersonalisations(fields: AnswersHashMap) {
  return {
    previouslyMarried: fields.maritalStatus !== "Never married",
    religious: fields.oathType === "Religious",
  };
}

export function getCNIPersonalisations(fields: AnswersHashMap) {
  return {
    livesInCountry: fields.livesInCountry === true,
    livesAbroad: !fields.livesInCountry,
    previouslyMarried: fields.maritalStatus !== "Never married",
    religious: fields.oathType === "Religious",
    croatiaCertNeeded: fields.certRequired === true,
    countryIsItaly: fields.country === "Italy",
  };
}

export function getExchangePersonalisations(fields: AnswersHashMap) {
  return {
    croatiaCertNeeded: fields.certRequired === true,
  };
}
