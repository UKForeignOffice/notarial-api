import { flattenQuestions } from "../../helpers";
import { testData } from "./fixtures";
import { SESService } from "../SESService";
import { isNotFieldType } from "../../../../utils";
import "pg-boss";

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

const emailService = new SESService();

const formFields = flattenQuestions(testData.questions);
const allOtherFields = formFields.filter(isNotFieldType("file"));

test("getEmailBody renders oath email correctly", () => {
  const emailBody = emailService.getEmailBody(allOtherFields, "affirmation");
  expect(emailBody.includes("<li>First name: foo</li>")).toBe(true);
});

test("getEmailBody renders cni template correctly", () => {
  expect(() => {
    emailService.getEmailBody(allOtherFields, "cni");
  }).toThrow();
});

test("sendEmail returns a jobId", async () => {
  const jobId = await emailService.sendEmail(
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
    await emailService.sendEmail(
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
