import { consularLetterTestData } from "./fixtures";
import { ConsularLetterCaseService } from "../ConsularLetterCaseService";
import "pg-boss";
import { flattenQuestions } from "../../../helpers";
import { isNotFieldType } from "../../../../../utils";
import { PayMetadata } from "../../../../../types/FormDataBody";
import * as fields from "./fixtures/fields";
import { ApplicationError } from "../../../../../ApplicationError";
import { PaymentViewModel } from "../../utils/PaymentViewModel";
import { PaymentData } from "../../types";
const sendToQueue = jest.fn();

const queueService = {
  sendToQueue,
};

const consularLetterCaseService = new ConsularLetterCaseService({ queueService });

const formFields = flattenQuestions(consularLetterTestData.questions);
const allOtherFields = formFields.filter(isNotFieldType("file"));
const paymentViewModel: PaymentData = {
  id: "govuk-pay-id",
  status: "success",
  url: "https://payments.gov.uk",
  allTransactionsByCountry: {
    url: "https://payments.gov.uk",
    country: "italy",
  },
  total: "100",
};

test("getEmailBody renders certify copy email correctly", () => {
  const emailBody = consularLetterCaseService.getEmailBody({ fields: allOtherFields, payment: paymentViewModel, reference: "1234" });
  expect(emailBody).toContain("<li>First name: test</li>");
  expect(emailBody).toContain("preparing a letter to release a body");
});

test("sendEmail returns a jobId", async () => {
  sendToQueue.mockResolvedValueOnce("ABC-123");
  const jobId = await consularLetterCaseService.sendEmail({
    fields: fields.consularLetter.remap,
    metadata: {
      reference: "..",
      payment: {
        payId: "",
        reference: "",
        state: { code: "", finished: false, message: "" },
      },
      type: "consularLetter",
    },
  });
  expect(jobId).toBe("ABC-123");
});

test("sendEmail throws ApplicationError when no jobId is returned", async () => {
  sendToQueue.mockRejectedValue(new ApplicationError("QUEUE", `SES_SEND_ERROR`, 500));
  try {
    await consularLetterCaseService.sendEmail({
      fields: fields.consularLetter.remap,
      template: "submission",
      metadata: {
        reference: "USER_REF",
        payment: consularLetterTestData.metadata.pay,
        type: "consularLetter",
      },
    });
  } catch (e) {
    expect(e.code).toBe("SES_SEND_ERROR");
    expect(e.name).toBe("QUEUE");
  }
});

test("buildJobData returns an object with subject, body, attachments and reference", async () => {
  const result = consularLetterCaseService.buildJobData({
    fields: allOtherFields,
    payment: consularLetterTestData.metadata.pay,
    reference: "1234",
    metadata: {
      reference: "1234",
      type: "consularLetter",
    },
    onComplete: {
      queue: "NOTIFY_SEND",
      job: {},
    },
  });
  expect(result).toEqual({
    subject: "Letter to release a body application, Thailand, the British Embassy Bangkok – 1234",
    body: expect.any(String),
    onComplete: {
      queue: "NOTIFY_SEND",
    },
    attachments: [],
    metadata: {
      reference: "1234",
      type: "consularLetter",
    },
    reference: "1234",
  });
});
