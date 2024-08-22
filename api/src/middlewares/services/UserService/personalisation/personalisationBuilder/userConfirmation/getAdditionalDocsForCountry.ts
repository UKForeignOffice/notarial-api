import { AnswersHashMap } from "../../../../../../types/AnswersHashMap";

export const getAdditionalDocsForCountry = {
  Montenegro: (_answers: AnswersHashMap, _additionalContext) => {
    return ["UK CNI issued by a UK register office"];
  },
};
