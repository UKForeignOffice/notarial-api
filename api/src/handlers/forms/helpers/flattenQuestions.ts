import { FormQuestion } from "../../../types/FormQuestion";

export function flattenQuestions(questions: FormQuestion[]) {
  return questions.flatMap(({ fields }) => {
    return fields;
  });
}
