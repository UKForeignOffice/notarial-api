import { AnswersHashMap } from "../../../../types/AnswersHashMap";
import * as additionalContexts from "../../utils/additionalContexts.json";

export function buildPostNotificationPersonalisation(answers: AnswersHashMap, reference: string) {
  const country = answers["country"] as string;
  const post = (answers["post"] ?? additionalContexts.countries?.[country]?.post) as string;

  return {
    post,
    reference,
  };
}
