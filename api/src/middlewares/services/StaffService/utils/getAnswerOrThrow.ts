import { ApplicationError } from "../../../../../ApplicationError";

export function getAnswerOrThrow(answers: any, key: string) {
  const answer = answers[key]?.answer;
  if (answer === undefined) {
    throw new ApplicationError("SES", "MISSING_ANSWER", 400, `Missing answer for ${key}`);
  }
  return answer;
}
