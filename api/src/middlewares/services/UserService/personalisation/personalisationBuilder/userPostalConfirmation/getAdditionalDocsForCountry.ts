import { AnswersHashMap } from "../../../../../../types/AnswersHashMap";

export const getAdditionalDocsForCountry = {
  Croatia: (_answers: AnswersHashMap, additionalContext) => {
    const additionalDocs = additionalContext?.additionalDocs ?? [];
    return [...additionalDocs, "certified copy of passport by a UK lawyer or a public notary"];
  },
};
