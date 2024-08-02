import { AnswersHashMap } from "../../../../../../types/AnswersHashMap";

export type AdditionalPersonalisationCountries = "Spain" | "Italy" | "Croatia";

type PersonalisationFunction = (fields: AnswersHashMap) => Record<string, boolean>;

export const postalPersonalisationsByCountry: Record<AdditionalPersonalisationCountries, PersonalisationFunction> = {
  Spain: getSpainAdditionalPersonalisations,
  Italy: getItalyAdditionalPersonalisations,
  Croatia: getCroatiaAdditionalPersonalisations,
};

export function getSpainAdditionalPersonalisations(answers: AnswersHashMap) {
  return {
    italySpainPartnerPreviousMarriageDocNeeded: answers.partnerMaritalStatus !== "Never married",
    ukProofOfAddressNeeded: !answers.livesInCountry,
    spainProofOfAddressNeeded: answers.livesInCountry === true,
    showSpainContent: true,
  };
}

export function getItalyAdditionalPersonalisations(answers: AnswersHashMap) {
  return {
    italySpainPartnerPreviousMarriageDocNeeded: answers.partnerMaritalStatus !== "Never married",
    ukProofOfAddressNeeded: !answers.livesInCountry,
  };
}

export function getCroatiaAdditionalPersonalisations(answers: AnswersHashMap) {
  return {
    croatiaCertNeeded: answers.certRequired === true,
  };
}
