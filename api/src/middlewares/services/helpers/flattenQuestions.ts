import { FormQuestion } from "../../../types/FormQuestion";

export function flattenQuestions(questions: FormQuestion[]) {
  return questions.flatMap(({ fields, category }) => {
    return fields.map((field) => ({ ...field, category }));
  });
}
