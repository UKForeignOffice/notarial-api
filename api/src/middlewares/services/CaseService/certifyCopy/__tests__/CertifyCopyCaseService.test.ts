import { certifyCopyTestData } from "./fixtures";
import { CertifyCopyCaseService } from "../CertifyCopyCaseService";
import "pg-boss";
import { flattenQuestions } from "../../../helpers";
import { isNotFieldType } from "../../../../../utils";
import { PayMetadata } from "../../../../../types/FormDataBody";
import * as fields from "./fixtures/fields";
import { ApplicationError } from "../../../../../ApplicationError";
import { PaymentViewModel } from "../../types";
const sendToQueue = jest.fn();

const queueService = {
  sendToQueue,
};

const certifyCopyCaseService = new CertifyCopyCaseService({ queueService });

const formFields = flattenQuestions(certifyCopyTestData.questions);
const allOtherFields = formFields.filter(isNotFieldType("file"));
const paymentViewModel: PaymentViewModel = {
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
  const emailBody = certifyCopyCaseService.getEmailBody({ fields: allOtherFields, payment: paymentViewModel, reference: "1234" });
  expect(emailBody).toContain("<li>First name: test</li>");
  expect(emailBody).toContain("certifying a copy of a passport");
});

test("sendEmail returns a jobId", async () => {
  sendToQueue.mockResolvedValueOnce("ABC-123");
  const jobId = await certifyCopyCaseService.sendEmail({
    fields: fields.certifyCopy.remap,
    metadata: {
      reference: "..",
      payment: {
        payId: "",
        reference: "",
        state: { code: "", finished: false, message: "" },
      },
      type: "certifyCopy",
    },
  });
  expect(jobId).toBe("ABC-123");
});

test("sendEmail throws ApplicationError when no jobId is returned", async () => {
  sendToQueue.mockRejectedValue(new ApplicationError("QUEUE", `SES_SEND_ERROR`, 500));
  try {
    await certifyCopyCaseService.sendEmail({
      fields: fields.certifyCopy.remap,
      template: "submission",
      metadata: {
        reference: "USER_REF",
        payment: certifyCopyTestData.metadata.pay,
        type: "certifyCopy",
      },
    });
  } catch (e) {
    console.log(e);
    expect(e.code).toBe("SES_SEND_ERROR");
    expect(e.name).toBe("QUEUE");
  }
});

test("buildJobData returns an object with subject, body, attachments and reference", async () => {
  const result = certifyCopyCaseService.buildJobData({
    fields: allOtherFields,
    payment: certifyCopyTestData.metadata.pay,
    reference: "1234",
    metadata: {
      reference: "1234",
      type: "certifyCopy",
    },
    onComplete: {
      queue: "NOTIFY_SEND",
      job: {},
    },
  });
  expect(result).toEqual({
    subject: "Certify a copy of a passport application - the British embassy Hanoi – 1234",
    body: expect.any(String),
    onComplete: {
      queue: "NOTIFY_SEND",
    },
    attachments: [],
    metadata: {
      reference: "1234",
      type: "certifyCopy",
    },
    reference: "1234",
  });
});

test("paymentViewModel returns undefined when no payment is provided", () => {
  const result = certifyCopyCaseService.paymentViewModel(undefined, "italy");
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
    total: 10000,
  };
  const result = certifyCopyCaseService.paymentViewModel(payMetadata, "italy");
  expect(result).toEqual({
    allTransactionsByCountry: {
      country: "italy",
      url: "https://selfservice.payments.service.gov.uk/account/ACCOUNT_ID/transactions?metadataValue=italy",
    },
    id: "123",
    status: "success",
    url: "https://selfservice.payments.service.gov.uk/account/ACCOUNT_ID/123",
    total: "100.00",
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
  const result = certifyCopyCaseService.paymentViewModel(payMetadata, "italy");

  const emailBody = certifyCopyCaseService.getEmailBody({ fields: allOtherFields, payment: result, reference: "1234" });
  expect(emailBody).toContain("Payment amount: 500");
});

test("Failed payments renders 'unpaid'", () => {
  const payMetadata: PayMetadata = {
    payId: "123",
    reference: "ref",
    state: {
      code: "",
      finished: true,
      message: "Some error",
      status: "failed",
    },
  };
  const result = certifyCopyCaseService.paymentViewModel(payMetadata, "italy");

  const emailBody = certifyCopyCaseService.getEmailBody({ fields: allOtherFields, payment: result, reference: "1234" });
  expect(emailBody).toContain("Payment amount: Unpaid");
});
