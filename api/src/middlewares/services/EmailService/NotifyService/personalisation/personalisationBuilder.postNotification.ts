import { AnswersHashMap } from "../../../../../types/AnswersHashMap";
import * as additionalContexts from "../../additionalContexts.json";
export function buildPostNotificationPersonalisation(answers: AnswersHashMap) {
  const country = answers["country"] as string;
  const post = (answers["post"] ?? additionalContexts.countries?.[country]?.post) as string;

  return {
    post,
  };
}
