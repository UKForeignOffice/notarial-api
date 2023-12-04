import { flattenQuestions } from "../../helpers/flattenQuestions";
import { isNotFieldType } from "../../../../utils/isNotFieldType";
import { AxiosError } from "axios";
import { ApplicationError } from "../../../../ApplicationError";
import { testData } from "./fixtures";
import { StaffEmailService } from "../StaffEmailService";

const fileService = {
  getFile: jest.fn().mockResolvedValue({ data: Buffer.from("an image"), contentType: "image/jpeg" }),
};

const sesService = {
  send: jest.fn().mockResolvedValue({ messageId: "1234" }),
};

const emailService = new StaffEmailService({ fileService, sesService });

const formFields = flattenQuestions(testData.questions);
const allOtherFields = formFields.filter(isNotFieldType("file"));

test("getEmailBody renders oath email correctly", () => {
  const emailBody = emailService.getEmailBody(allOtherFields, "oath");
  expect(emailBody.includes("<li>First name: foo</li>")).toBe(true);
});

test("getEmailBody renders cni template correctly", () => {
  expect(() => {
    emailService.getEmailBody(allOtherFields, "cni");
  }).toThrow();
});

test("buildEmail returns valid raw email", async () => {
  const fileFields = [
    {
      answer: "somewhere/123",
      key: "favouriteEgg",
      title: "Favourite egg",
      type: "file",
    },
  ];

  const email = await emailService.buildEmail(allOtherFields, "oath", fileFields, "1234");
  expect(email.includes("Date:")).toBeTruthy();
  expect(email.includes("From:")).toBeTruthy();
  expect(email.includes("Message-ID")).toBeTruthy();
  expect(email.includes("Content-Type: text/html; charset=UTF-8")).toBeTruthy();
  expect(email.includes('Content-Type: image/jpeg; name="Favourite egg')).toBeTruthy();
  expect(email.includes('Content-Disposition: attachment; filename="Favourite egg"')).toBeTruthy();
});

test("buildEmailWithAttachments throws ApplicationError when fileService rejects", async () => {
  fileService.getFile.mockRejectedValueOnce(new AxiosError("some axios error", "AXIOS_ERR"));
  const fileFields = [
    {
      answer: "somewhere/123",
      key: "favouriteEgg",
      title: "Favourite egg",
      type: "file",
    },
  ];
  await expect(emailService.buildEmail(allOtherFields, "oath", fileFields, "1234")).rejects.toThrowError(ApplicationError);
});

test("sendEmail throws ApplicationError when SES rejects", () => {
  const spy = jest.spyOn(emailService.provider, "send");
  spy.mockRejectedValueOnce(new ApplicationError("SES", "API_ERROR", 500, "some message"));
  expect(emailService.sendEmail("foo")).rejects.toThrowError(ApplicationError);
});
