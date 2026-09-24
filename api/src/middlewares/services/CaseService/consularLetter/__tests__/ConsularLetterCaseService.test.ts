import { consularLetterTestData } from "./fixtures";
import { ConsularLetterCaseService } from "../ConsularLetterCaseService";
import "pg-boss";
import { flattenQuestions } from "../../../helpers";
import { isFieldType } from "../../../../../utils";
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
const fileFields = formFields.filter(isFieldType("file"));
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

test("getEmailBody renders the submitted Thailand application details", () => {
  const emailBody = consularLetterCaseService.getEmailBody({ fields: formFields, payment: paymentViewModel, reference: "1234" });
  const contactDetails = emailBody.split("<h4>Contact details</h4>")[1]?.split("</ul>")[0] ?? "";
  const nokDetails = emailBody.split("<h4>Details of deceased’s family</h4>")[1]?.split("</ul>")[0] ?? "";
  expect(emailBody).toContain("<li>First name: test</li>");
  expect(emailBody).toContain("preparing a letter to release a body");
  expect(emailBody).toContain("Family member: false");
  expect(emailBody).toContain("Appointed by the deceased’s family: true");
  expect(emailBody).toContain("Passport of person who died: true");
  expect(emailBody).toContain("How to receive consular letter: Post");
  expect(emailBody).toContain("Contact preference: Email");
  expect(emailBody).toContain("Relationship to deceased if other: A friend");
  expect(emailBody).toContain("<h4>Application details</h4>");
  expect(contactDetails).toContain("<li>Email address: applicant@test.com</li>");
  expect(contactDetails).toContain("<li>Phone number: +66 1234 567890</li>");
  expect(emailBody).toContain("<h4>Details of deceased’s family</h4>");
  expect(nokDetails).toContain("<li>Email address of the deceased’s family: nok@test.com</li>");
  expect(nokDetails).toContain("<li>Phone number of the deceased’s family: +44 1234 567890</li>");
  expect(emailBody).toContain("<h4>Contact details</h4>");
  expect(emailBody).toContain("<h4>Company address</h4>");
  expect(emailBody).toContain("<h4>Delivery details</h4>");
  expect(emailBody).toContain("<h4>Feedback</h4>");
  expect(emailBody).not.toContain("Applicant is next of kin");
  expect(emailBody).not.toContain("UK passport of person who died:");
  expect(emailBody).not.toContain("https://document-upload-endpoint");
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
    fields: formFields,
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
    attachments: fileFields,
    metadata: {
      reference: "1234",
      type: "consularLetter",
    },
    reference: "1234",
  });
});
