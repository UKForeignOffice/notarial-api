import { AnswersHashMap } from "../../../../../types/AnswersHashMap";
import { postNotification } from "./postNotification";

type PostNotification = typeof postNotification;
export function buildPostNotificationPersonalisation(answers: AnswersHashMap): PostNotification {
  const post = answers["post"] as string;
  return {
    post,
  };
}
