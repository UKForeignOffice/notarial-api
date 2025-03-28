import { testData } from "./fixtures";
import { MarriageCaseService } from "../MarriageCaseService";
import "pg-boss";
import { flattenQuestions } from "../../../helpers";
import { isNotFieldType } from "../../../../../utils";
import { PayMetadata } from "../../../../../types/FormDataBody";
import * as fields from "./fixtures/fields";
import { ApplicationError } from "../../../../../ApplicationError";
import { PaymentViewModel } from "../../utils/PaymentViewModel";
const sendToQueue = jest.fn();

const queueService = {
  sendToQueue,
};

const marriageCaseService = new MarriageCaseService({ queueService });

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
  total: "100",
};

test("getEmailBody renders oath email correctly", () => {
  const emailBody = marriageCaseService.getEmailBody({ fields: allOtherFields, payment: paymentViewModel, reference: "1234" }, "affirmation");
  expect(emailBody).toContain("<li>First name: foo</li>");
  expect(emailBody).toContain("marital status affirmation");
});

test("getEmailBody renders cni template correctly", () => {
  const emailBody = marriageCaseService.getEmailBody({ fields: allOtherFields, payment: paymentViewModel, reference: "1234" }, "cni");
  expect(emailBody).toContain("<li>First name: foo</li>");
  expect(emailBody).toContain("notice of marriage and marital status affirmation");
});

test("getEmailBody handles a cni postal form properly", () => {
  const emailBody = marriageCaseService.getEmailBody({ fields: allOtherFields, payment: paymentViewModel, reference: "1234", postal: true }, "cni");
  expect(emailBody).toContain("<li>First name: bar</li>");
});

test("getEmailBody handles a cni form with postal set to false properly", () => {
  const emailBody = marriageCaseService.getEmailBody({ fields: allOtherFields, payment: paymentViewModel, reference: "1234", postal: false }, "cni");
  expect(emailBody).toContain("<li>First name: foo</li>");
  expect(emailBody).toContain("notice of marriage and marital status affirmation");
});

test("sendEmail returns a jobId", async () => {
  sendToQueue.mockResolvedValueOnce("ABC-123");
  const jobId = await marriageCaseService.sendEmail({
    fields: fields.affirmation.remap,
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
    await marriageCaseService.sendEmail({
      fields: fields.affirmation.remap,
      template: "submission",
      metadata: {
        reference: "USER_REF",
        payment: testData.metadata.pay,
        type: "affirmation",
      },
    });
  } catch (e) {
    expect(e.code).toBe("SES_SEND_ERROR");
    expect(e.name).toBe("QUEUE");
  }
});

test("buildJobData returns an object with subject, body, attachments and reference", async () => {
  const result = marriageCaseService.buildJobData({
    fields: allOtherFields,
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
    subject: "Local marriage application - British Consulate General Istanbul – 1234",
    body: expect.any(String),
    onComplete: {
      queue: "NOTIFY_SEND",
    },
    attachments: [],
    metadata: {
      reference: "1234",
      type: "affirmation",
    },
    reference: "1234",
  });
});

test("generated paymentViewModel is rendered correctly", () => {
  const payMetadata: PayMetadata = {
    payId: "123",
    reference: "ref",
    state: {
      status: "success",
      finished: true,
    },
    total: 50000,
  };
  const result = PaymentViewModel(payMetadata, "italy");

  const emailBody = marriageCaseService.getEmailBody({ fields: allOtherFields, payment: result, reference: "1234" }, "affirmation");
  expect(emailBody).toContain("Payment amount: 500");
});
