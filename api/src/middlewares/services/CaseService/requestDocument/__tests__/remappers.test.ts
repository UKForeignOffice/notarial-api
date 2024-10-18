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
  test("when partner is a British national", () => {
    const remapped = requestDocumentRemapper(fields.adoption.adoptionFields);
    expect(remapped.country).toBeDefined();
    expect(remapped.partnerDetails.partnerFirstName).toBeDefined();
    expect(remapped.partnerDetails.partnerIsBN).toBeDefined();
    expect(remapped.partnerDetails.partnerPassportNumber).toBeDefined();
    expect(remapped.partnerDetails.partnerCountryOfBirth).toBeDefined();
  });

  test("when partner is a not British national", () => {
    const remapped = requestDocumentRemapper(fields.adoption.adoptionFieldsPartnerIsNotBn);
    expect(remapped.partnerDetails.partnerFirstName).not.toBeDefined();
    expect(remapped.partnerDetails.partnerIsBN.answer).toBe(false);
    expect(remapped.partnerDetails.partnerPassportNumber).not.toBeDefined();
    expect(remapped.partnerDetails.partnerCountryOfBirth).not.toBeDefined();
  });
});

test("requestDocument - Andorra MSC - unique fields are included", () => {
  const remapped = requestDocumentRemapper(fields.andorraMsc);
  expect(remapped.reason.reason).toBeDefined();
});

test("requestDocument - Thailand Citizenship - unique fields are included", () => {
  const remapped = requestDocumentRemapper(fields.thaiCitizenship);
  expect(remapped.delivery.addressLine1).toBeDefined();
  expect(remapped.delivery.addressLine2).toBeDefined();
  expect(remapped.delivery.city).toBeDefined();
  expect(remapped.delivery.country).not.toBeDefined();
});

test("requestDocument - Belgium Certificate of custom law", () => {
  const remapped = requestDocumentRemapper(fields.belgiumCustomLaw);
  expect(remapped.delivery.addressLine1).toBeDefined();
  expect(remapped.delivery.addressLine2).toBeDefined();
  expect(remapped.delivery.city).toBeDefined();
  expect(remapped.delivery.country).toBeDefined();
});

test("request Document - Meixco - unique fields are included", () => {
  const remapped = requestDocumentRemapper(fields.mexico);
  expect(remapped.reason.reason).toBeDefined();
});
