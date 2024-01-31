import { flattenQuestions } from "../../helpers";
import { testData } from "./fixtures";
import { SESService } from "../SESService";
import { isNotFieldType } from "../../../../utils";
import { ApplicationError } from "../../../../ApplicationError";
import { SendRawEmailCommand } from "@aws-sdk/client-ses";
import "pg-boss";
import { AxiosError } from "axios";
jest.mock("pg-boss", () => {
  return jest.fn().mockImplementation(() => {
    return { start: async () => this };
  });
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

test("sendEmail throws ApplicationError when no jobId is returned", async () => {
  const spy = jest.spyOn(emailService, "send");
  //@ts-ignore
  spy.mockRejectedValueOnce(new ApplicationError("SES", "API_ERROR", 500, "some message"));
  expect(
    emailService.sendEmail(
      new SendRawEmailCommand({
        RawMessage: {
          Data: Buffer.from("foo"),
        },
      }),
      "1234"
    )
  ).rejects.toThrowError(ApplicationError);
});
