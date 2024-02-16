import { AnswersHashMap } from "../../../../../types/AnswersHashMap";
import { postNotification } from "./postNotification";
import * as additionalContexts from "../../additionalContexts.json";

type PostNotification = typeof postNotification;
export function buildPostNotificationPersonalisation(answers: AnswersHashMap): PostNotification {
  const country = answers["country"] as string;
  const post = (answers["post"] ?? additionalContexts.countries?.[country]?.post) as string;

  return {
    post,
  };
}
