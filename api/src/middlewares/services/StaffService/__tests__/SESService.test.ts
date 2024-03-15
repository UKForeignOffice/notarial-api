import { testData } from "./fixtures";
import { StaffService } from "../StaffService";
import "pg-boss";
import { flattenQuestions } from "../../helpers";
import { isNotFieldType } from "../../../../utils";
import { PayMetadata } from "../../../../types/FormDataBody";
import { fields } from "./fixtures/fields";
import { ApplicationError } from "../../../../ApplicationError";
const sendToQueue = jest.fn();

const queueService = {
  sendToQueue,
};

const emailService = new StaffService({ queueService });

const formFields = flattenQuestions(testData.questions);
const allOtherFields = formFields.filter(isNotFieldType("file"));
const paymentViewModel = {
  id: "govuk-pay-id",
  status: "success",
  url: "https://payments.gov.uk",
  allTransactionsByCountry: {
    url: "https://payments.gov.uk",
    country: "italy",
  },
};

test("getEmailBody renders oath email correctly", () => {
  const emailBody = emailService.getEmailBody({ fields: allOtherFields, payment: paymentViewModel, reference: "1234" }, "submission", "affirmation");
  expect(emailBody).toContain("<li>First name: foo</li>");
  expect(emailBody).toContain("marital status affirmation");
});

test("getEmailBody renders cni template correctly", () => {
  const emailBody = emailService.getEmailBody({ fields: allOtherFields, payment: paymentViewModel, reference: "1234" }, "submission", "cni");
  expect(emailBody).toContain("<li>First name: foo</li>");
  expect(emailBody).toContain("notice of marriage and marital status affirmation");
});

test("sendEmail returns a jobId", async () => {
  sendToQueue.mockResolvedValueOnce("ABC-123");
  const jobId = await emailService.sendEmail({
    fields: fields,
    template: "submission",
    metadata: {
      reference: "..",
      payment: {
        payId: "",
        reference: "",
        state: { code: "", finished: false, message: "" },
      },
      type: "affirmation",
    },
  });
  expect(jobId).toBe("ABC-123");
});

test("sendEmail throws ApplicationError when no jobId is returned", async () => {
  sendToQueue.mockRejectedValue(new ApplicationError("QUEUE", `SES_SEND_ERROR`, 500));
  try {
    await emailService.sendEmail({
      fields,
      template: "submission",
      metadata: {
        reference: "USER_REF",
        payment: testData.metadata.pay,
        type: "affirmation",
      },
    });
  } catch (e) {
    console.log(e);
    expect(e.code).toBe("SES_SEND_ERROR");
    expect(e.name).toBe("QUEUE");
  }
});

test("buildSendEmailArgs returns an object with subject, body, attachments and reference", async () => {
  const result = emailService.buildSendEmailArgs({
    fields: allOtherFields,
    template: "submission",
    payment: testData.metadata.pay,
    reference: "1234",
    metadata: {
      reference: "1234",
      type: "affirmation",
    },
    onComplete: {
      queue: "NOTIFY_SEND",
      job: {},
    },
  });
  expect(result).toEqual({
    subject: "affirmation application, British Consulate General Istanbul – 1234",
    body: expect.any(String),
    onComplete: {
      queue: "NOTIFY_SEND",
    },
    attachments: [],
    metadata: {
      reference: "1234",
    },
    reference: "1234",
  });
});

test("paymentViewModel returns undefined when no payment is provided", () => {
  const result = emailService.paymentViewModel(undefined, "italy");
  expect(result).toBeUndefined();
});

test("paymentViewModel returns a PaymentViewModel", () => {
  const payMetadata: PayMetadata = {
    payId: "123",
    reference: "ref",
    state: {
      status: "success",
      finished: true,
    },
  };
  const result = emailService.paymentViewModel(payMetadata, "italy");
  expect(result).toEqual({
    allTransactionsByCountry: {
      country: "italy",
      url: "https://selfservice.payments.service.gov.uk/account/ACCOUNT_ID/transactions?metadataValue=italy",
    },
    id: "123",
    status: "success",
    url: "https://selfservice.payments.service.gov.uk/account/ACCOUNT_ID/123",
  });
});
