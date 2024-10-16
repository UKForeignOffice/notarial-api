import { data as testData } from "./fixtures/data";
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
    country: "italy",
  },
  total: "100",
};

test.todo("getEmailBody renders document name correctly");
test.todo("getEmailBody renders country if the serviceType is adoption");
