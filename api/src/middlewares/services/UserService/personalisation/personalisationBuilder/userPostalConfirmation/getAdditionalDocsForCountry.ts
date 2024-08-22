import { AnswersHashMap } from "../../../../../../types/AnswersHashMap";

export const getAdditionalDocsForCountry = {
  Italy: (answers: AnswersHashMap, _additionalContext) => {
    const partnerHadPreviousMarriage = answers.partnerMaritalStatus !== "Never married";
    const livesInItaly = answers.livesInCountry === true;

    const additionalDocs = ["your parents’ full names"];

    if (livesInItaly) {
      additionalDocs.push("original proof of address or a certified copy you live in Italy");
    }

    if (!livesInItaly) {
      additionalDocs.push("original proof of address or a certified copy if your permanent address is outside Italy");
    }

    if (partnerHadPreviousMarriage) {
      additionalDocs.push("the document that proves any previous marriages or civil partnerships hav ended");
    }

    return additionalDocs;
  },

  Croatia: (answers: AnswersHashMap, additionalContext) => {
    const additionalDocs = additionalContext?.additionalDocs ?? [];
    return [...additionalDocs, "certified copy of passport by a UK lawyer or a public notary"];
  },
};
