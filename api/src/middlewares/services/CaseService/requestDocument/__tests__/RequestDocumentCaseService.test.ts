import { data as testData, fields } from "./fixtures/data";
import "pg-boss";
import { flattenQuestions } from "../../../helpers";
import { isNotFieldType } from "../../../../../utils";
import { RequestDocumentCaseService } from "../requestDocumentCaseService";
const sendToQueue = jest.fn();

const queueService = {
  sendToQueue,
};

const requestDocumentCaseService = new RequestDocumentCaseService({ queueService });

const formFields = flattenQuestions(testData.data.questions);
const allOtherFields = formFields.filter(isNotFieldType("file"));
const paymentViewModel = {
  id: "govuk-pay-id",
  status: "success",
  url: "https://payments.gov.uk",
  allTransactionsByCountry: {
    url: "https://payments.gov.uk",
    service: "any",
    country: "any",
  },
  total: "100",
};

test("getEmailBody renders document name correctly", () => {
  const emailBody = requestDocumentCaseService.getEmailBody({
    fields: allOtherFields,
    payment: paymentViewModel,
    reference: "ref",
  });
  expect(emailBody).toContain("Document: USA - J1 visa no objection statement");
});

describe("getEmailBody renders correct sections for adoption", () => {
  test("when partner is BN", () => {
    const adoptionFields = [...fields.adoption.adoptionFields].filter(isNotFieldType("file"));

    const emailBody = requestDocumentCaseService.getEmailBody({
      fields: adoptionFields,
      payment: paymentViewModel,
      reference: "ref",
    });

    expect(emailBody).toContain("Passport number: 123123");
    expect(emailBody).toContain("Partner is a British National: true");
    expect(emailBody).toContain("Passport number: 987987");
  });
  test("when partner is not BN", () => {
    const adoptionFields = [...fields.adoption.adoptionFieldsPartnerIsNotBn].filter(isNotFieldType("file"));

    const emailBody = requestDocumentCaseService.getEmailBody({
      fields: adoptionFields,
      payment: paymentViewModel,
      reference: "ref",
    });

    expect(emailBody).toContain("Passport number: 123123");
    expect(emailBody).toContain("Partner is a British National: false");
    expect(emailBody).not.toContain("Passport number: 987987");
  });
});
