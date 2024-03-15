import { testData } from "./fixtures";
import { StaffService } from "../StaffService";
import "pg-boss";
import { flattenQuestions } from "../../helpers";
import { isNotFieldType } from "../../../../utils";
import { PayMetadata } from "../../../../types/FormDataBody";

const pgBossMock = {
  async start() {
    return this;
  },
  send: async () => {
    return "some-job-id";
  },
};

jest.mock("pg-boss", () => {
  return jest.fn().mockImplementation(() => pgBossMock);
});

const staffService = {

}

const emailService = new StaffService({
  sendToQueue:
});

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
  const jobId = await emailService.sendToSendQueue(
    {
      subject: "your application",
      body: "has been accepted",
      attachments: [],
      reference: "1234",
    },
    "1234"
  );
  expect(jobId).toBe("some-job-id");
});

test("sendEmail throws ApplicationError when no jobId is returned", async () => {
  const sendSpy = jest.spyOn(pgBossMock, "send");
  sendSpy.mockResolvedValueOnce(null);

  try {
    await emailService.sendToSendQueue(
      {
        subject: "your application",
        body: "has been accepted",
        attachments: [],
        reference: "1234",
      },
      "1234"
    );
  } catch (e) {
    expect(e.code).toBe("QUEUE_ERROR");
    expect(e.name).toBe("SES");
  }
});

test("buildSendEmailArgs returns an object with subject, body, attachments and reference", async () => {
  const result = await emailService.buildSendEmailArgs({
    fields: allOtherFields,
    template: "submission",
    payment: testData.metadata.pay,
    metadata: {
      reference: "1234",
      type: "affirmation",
      postAlertOptions: {},
    },
  });
  expect(result).toEqual({
    subject: "affirmation application, British Consulate General Istanbul – 1234",
    body: expect.any(String),
    postAlertOptions: {},
    attachments: [],
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
