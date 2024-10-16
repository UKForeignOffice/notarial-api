import { flattenQuestions } from "../../../helpers";
import { requestDocumentRemapper, requestDocumentReorderer } from "../helpers";
import { data } from "./fixtures/data";

test("requestDocument is successfully remapped", () => {
  const flattened = flattenQuestions(data.data.questions);
  const remapped = requestDocumentRemapper(flattened);
  expect(remapped).toMatchSnapshot();
});

test("requestDocument is successfully reordered", () => {
  const flattened = flattenQuestions(data.data.questions);
  const remapped = requestDocumentRemapper(flattened);
  const reordered = requestDocumentReorderer(remapped);
  expect(reordered).toMatchSnapshot();
});
