import { AnswersHashMap } from "../../../../types/AnswersHashMap";
import * as additionalContexts from "../../utils/additionalContexts.json";
import { FormType } from "../../../../types/FormDataBody";

const personalisationMappings: Record<FormType, object> = {
  affirmation: {
    applicationName: "marital status affirmation",
    caseType: "an affirmation",
  },
  cni: {
    applicationName: "CNI",
    caseType: "a CNI",
  },
  exchange: {
    applicationName: "exchange of a UK CNI",
    caseType: "an affirmation",
  },
  msc: {
    applicationName: "MSC",
    caseType: "a MSC",
  },
  cniAndMsc: {
    applicationName: "CNI and MSC",
    caseType: "a CNI and MSC",
  },
};
export function buildPostNotificationPersonalisation(answers: AnswersHashMap, type: FormType, reference: string) {
  const country = answers["country"] as string;
  const post = (answers["post"] ?? additionalContexts.countries?.[country]?.post) as string;

  return {
    post,
    type,
    reference,
    ...personalisationMappings[type],
  };
}
