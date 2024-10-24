import { AnswersHashMap, ConsularLetterAnswersHashmap } from "../../../../../../types/AnswersHashMap";
import { FormType, PayMetadata } from "../../../../../../types/FormDataBody";
import { ApplicationError } from "../../../../../../ApplicationError";

export function consularLetterPersonalisationBuilder(answers: AnswersHashMap, metadata: { reference: string; payment?: PayMetadata; type?: FormType }) {
  if (!answers) {
    throw new ApplicationError("WEBHOOK", "VALIDATION", 500, "Fields are empty");
  }

  const consularLetterAnswers = answers as ConsularLetterAnswersHashmap;
  const { hasDeceasedsPassport } = consularLetterAnswers;

  return {
    reference: metadata.reference,
    firstName: answers.firstName,
    hasDeceasedsPassport,
  };
}
