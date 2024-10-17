import { flattenQuestions } from "../../../helpers";
import { requestDocumentRemapper, requestDocumentReorderer } from "../helpers";
import { data, fields } from "./fixtures/data";

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

describe("requestDocument - adoption letter - unique fields are included", () => {
  test("remapper", () => {
    const remapped = requestDocumentRemapper(fields.adoption);
    expect(remapped.partnerDetails.partnerFirstName).toBeDefined();
    expect(remapped.partnerDetails.partnerIsBN).toBeDefined();
    expect(remapped.partnerDetails.partnerPassportNumber).toBeDefined();
    expect(remapped.partnerDetails.partnerCountryOfBirth).toBeDefined();
  });
});
