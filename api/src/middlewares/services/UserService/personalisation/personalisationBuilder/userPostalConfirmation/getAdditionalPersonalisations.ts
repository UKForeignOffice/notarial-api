import { AnswersHashMap } from "../../../../../../types/AnswersHashMap";

export type AdditionalPersonalisationCountries = "Spain" | "Italy" | "Croatia";

type PersonalisationFunction = (fields: AnswersHashMap) => Record<string, boolean>;

export const postalPersonalisationTypeMap: Record<AdditionalPersonalisationCountries, PersonalisationFunction> = {
  Spain: getSpainAdditionalPersonalisations,
  Italy: getItalyAdditionalPersonalisations,
  Croatia: getCroatiaAdditionalPersonalisations,
};

export function getSpainAdditionalPersonalisations(answers: AnswersHashMap) {
  return {
    livesInCountry: answers.livesInCountry === true,
    italySpainPartnerPreviousMarriageDocNeeded: answers.partnerMaritalStatus !== "Never married",
    ukProofOfAddressNeeded: !answers.livesInCountry,
  };
}

export function getItalyAdditionalPersonalisations(answers: AnswersHashMap) {
  return {
    italySpainPartnerProofOfAddress: answers.livesInCountry === true,
    ukProofOfAddressNeeded: !answers.livesInCountry,
  };
}

export function getCroatiaAdditionalPersonalisations(answers: AnswersHashMap) {
  return {
    croatiaCertNeeded: answers.certRequired === true,
  };
}
