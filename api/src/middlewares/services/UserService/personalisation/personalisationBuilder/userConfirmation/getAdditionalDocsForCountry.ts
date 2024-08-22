import { AnswersHashMap } from "../../../../../../types/AnswersHashMap";
import { FormType, PayMetadata } from "../../../../../../types/FormDataBody";

type Metadata = { type: FormType; reference: string; payment?: PayMetadata };

export const getAdditionalDocsForCountry = {
  Montenegro: (_answers: AnswersHashMap, _additionalContext, metadata: Metadata) => {
    if (metadata?.type === "affirmation") {
      return [];
    }
    return ["UK CNI issued by a UK register office"];
  },
};
