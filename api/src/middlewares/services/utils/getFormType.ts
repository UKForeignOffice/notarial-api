import { AnswersHashMap } from "../../../types/AnswersHashMap";
import { FormType } from "../../../types/FormDataBody";

export function getFormType(answers: AnswersHashMap, type: FormType): FormType {
  if (answers.service) {
    return answers.service as FormType;
  }
  if (answers.over16) {
    return answers.over16 ? "certifyCopyAdult" : "certifyCopyChild";
  }
  return type ?? "affirmation";
}
