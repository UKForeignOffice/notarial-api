import { AnswersHashMap } from "../../../../../types/AnswersHashMap";

export function buildPostNotificationPersonalisation(answers: AnswersHashMap) {
  const post = answers["post"] as string;

  return {
    post,
  };
}
