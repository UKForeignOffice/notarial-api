import { AnswersHashMap } from "../../../../../../types/AnswersHashMap";

export const getAdditionalDocsForCountry = {
  Montenegro: (answers: AnswersHashMap, additionalContext) => {
    const additionalDocs = additionalContext.additionalDocss;
    return [...additionalDocs, "UK CNI issued by a UK register office"];
  },
};
