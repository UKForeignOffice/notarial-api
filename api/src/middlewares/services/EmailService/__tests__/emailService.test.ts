import { SESService } from "../SESService";
import { flattenQuestions } from "../../../../handlers/forms/helpers/flattenQuestions";
import { isNotFieldType } from "../../../../utils/isNotFieldType";
import { AxiosError } from "axios";
import { ApplicationError } from "../../../../ApplicationError";
import { SESServiceException } from "@aws-sdk/client-ses";

const testData = {
  name: "Prove Your Eligibility to a Foreign Government affirmation",
  questions: [
    {
      category: "GIUBrH",
      question: "Select a British embassy or consulate",
      fields: [
        {
          key: "MHAYRo",
          title: "Select a location",
          type: "list",
          answer: "Istanbul",
        },
      ],
    },
    {
      question: "Have you been married or in a civil partnership before?",
      fields: [
        {
          key: "brkQJy",
          title: "Married or CP before?",
          type: "list",
          answer: true,
        },
      ],
    },
    {
      question: "What is your current marital status?",
      fields: [
        {
          key: "oNhRKo",
          title: "Marital status",
          type: "list",
          answer: "Divorced",
        },
      ],
    },
    {
      category: "sErzlA",
      question: "Decree absolute",
      fields: [
        {
          key: "gkxprY",
          title: "Decree absolute",
          type: "file",
          answer: "http://documentupload:9000/v1/files/cd24ed8a-409c-4f65-b59e-86e49d634f36.png",
        },
      ],
    },
    {
      category: "shGfJV",
      question: "About your divorce",
      fields: [
        {
          key: "vSlgqy",
          title: "Date of issue of decree absolute",
          type: "date",
          answer: "2000-12-25",
        },
        {
          key: "zXsOkJ",
          title: "Place of issue of decree absolute",
          type: "text",
          answer: "Derby",
        },
      ],
    },
    {
      category: "sErzlA",
      question: "UK passport",
      fields: [
        {
          key: "IYkNwD",
          title: "UK passport",
          type: "file",
          answer: "http://documentupload:9000/v1/files/9adc0833-2c00-491d-b0ea-3229024ea6a3.png",
        },
      ],
    },
    {
      category: "WsLsJg",
      question: "Full name",
      fields: [
        {
          key: "sgfroO",
          title: "First name",
          type: "text",
          answer: "Jen",
        },
        {
          key: "CNAsiH",
          title: "Middle name",
          type: "text",
          answer: "middle",
        },
        {
          key: "sQhPRP",
          title: "Surname",
          type: "text",
          answer: "Duong",
        },
      ],
    },
    {
      category: "WsLsJg",
      question: "UK passport details",
      fields: [
        {
          key: "KfBDDG",
          title: "Passport number",
          type: "text",
          answer: "12312311",
        },
        {
          key: "llZZFF",
          title: "Country of birth",
          type: "list",
          answer: "United Kingdom",
        },
        {
          key: "iNhNMn",
          title: "Date of birth",
          type: "date",
          answer: "2000-12-25",
        },
        {
          key: "SgaocB",
          title: "Place of birth ",
          type: "text",
          answer: "london",
        },
        {
          key: "KuFQHL",
          title: "Male or female",
          type: "list",
          answer: "Female",
        },
        {
          key: "QtsMpE",
          title: "Date of issue of passport",
          type: "date",
          answer: "2016-12-25",
        },
      ],
    },
    {
      category: "sErzlA",
      question: "Proof of address",
      fields: [
        {
          key: "tZXpuQ",
          title: "Proof of address",
          type: "file",
          answer: "http://documentupload:9000/v1/files/21054d8b-2069-4162-920c-31f4cbf81d5a.png",
        },
      ],
    },
    {
      category: "WsLsJg",
      question: "Address",
      fields: [
        {
          key: "ncyOTQ",
          title: "Address line 1",
          type: "text",
          answer: "1 phipp street",
        },
        {
          key: "svmzHm",
          title: "Address line 2 ",
          type: "text",
          answer: null,
        },
        {
          key: "xAQXXj",
          title: "Address line 3 ",
          type: "text",
          answer: null,
        },
        {
          key: "nhkPTu",
          title: "Town or city",
          type: "text",
          answer: "london",
        },
        {
          key: "IfqKmS",
          title: "County or region",
          type: "text",
          answer: null,
        },
        {
          key: "NdQYWv",
          title: "Zipcode or postcode ",
          type: "text",
          answer: "ec2a4ps",
        },
      ],
    },
    {
      category: "sErzlA",
      question: "Partner's passport or national identity card",
      fields: [
        {
          key: "qFuyQg",
          title: "Partner's passport or identity card",
          type: "file",
          answer: "http://documentupload:9000/v1/files/092161ad-afcf-4474-a5e7-4901bbc3185c.png",
        },
      ],
    },
    {
      category: "WsLsJg",
      question: "Contact details",
      fields: [
        {
          key: "applicantEmail",
          title: "Email address",
          type: "text",
          answer: "jen@cautionyourblast.com",
        },
        {
          key: "applicantPhone",
          title: "Phone number",
          type: "text",
          answer: "123123",
        },
      ],
    },
    {
      category: "WsLsJg",
      question: "Confirm your contact details",
      fields: [],
    },
    {
      category: "WsLsJg",
      question: "Main occupation",
      fields: [
        {
          key: "ZZHoIt",
          title: "Occupation",
          type: "text",
          answer: "engineer",
        },
      ],
    },
    {
      category: "UpLyUo",
      question: "Your father's details",
      fields: [
        {
          key: "AUPxcz",
          title: "Father's full name",
          type: "text",
          answer: "Foo",
        },
      ],
    },
    {
      category: "WsLsJg",
      question: "Your mother's details",
      fields: [
        {
          key: "gnWqOi",
          title: "Mother's full name",
          type: "text",
          answer: "Bar",
        },
        {
          key: "bmWUyr",
          title: "Maiden name",
          type: "text",
          answer: "Baz",
        },
      ],
    },
    {
      category: "YBdlSQ",
      question: "Do you want to swear a religious or non-religious oath?",
      fields: [
        {
          key: "OXteTH",
          title: "Type of oath",
          type: "list",
          answer: "Affirmation (non-religious)",
        },
      ],
    },
    {
      category: "IzAzlV",
      question: "Pay for your application",
      fields: [
        {
          key: "ofpFsm",
          title: "Payment type",
          type: "list",
          answer: "In-person",
        },
      ],
    },
  ],
  metadata: {
    paymentSkipped: false,
  },
};

const fileService = {
  getFile: jest.fn().mockResolvedValue({ data: Buffer.from("an image"), contentType: "image/jpeg" }),
};

const emailService = new SESService({
  fileService,
});

const formFields = flattenQuestions(testData.questions);
const allOtherFields = formFields.filter(isNotFieldType("file"));

test("buildOathBody renders correctly", () => {
  const emailBody = emailService.buildOathEmailBody(allOtherFields);
  expect(emailBody.includes("<li>Maiden name: Baz</li>")).toBe(true);
});

test("buildCNIBody renders correctly", () => {
  expect(emailService.buildCNIEmailBody).toThrow();
});

test("buildEmailWithAttachments returns valid raw email", async () => {
  const emailBody = emailService.buildOathEmailBody(allOtherFields);

  const email = await emailService.buildEmailWithAttachments({
    subject: "some subject",
    body: emailBody,
    attachments: [
      {
        answer: "somewhere/123",
        key: "favouriteEgg",
        title: "Favourite egg",
        type: "file",
      },
    ],
  });
  expect(email.includes("Date:")).toBeTruthy();
  expect(email.includes("From:")).toBeTruthy();
  expect(email.includes("Message-ID")).toBeTruthy();
  expect(email.includes("Content-Type: text/html; charset=UTF-8")).toBeTruthy();
  expect(email.includes('Content-Type: image/jpeg; name="Favourite egg')).toBeTruthy();
  expect(email.includes('Content-Disposition: attachment; filename="Favourite egg"')).toBeTruthy();
});

test("buildEmailWithAttachments throws ApplicationError when fileService rejects", async () => {
  fileService.getFile.mockRejectedValueOnce(new AxiosError("some axios error", "AXIOS_ERR"));
  const emailBody = emailService.buildOathEmailBody(allOtherFields);
  await expect(
    emailService.buildEmailWithAttachments({
      subject: "some subject",
      body: emailBody,
      attachments: [
        {
          answer: "somewhere/123",
          key: "favouriteEgg",
          title: "Favourite egg",
          type: "file",
        },
      ],
    })
  ).rejects.toThrowError(ApplicationError);
});

test("sendEmail throws ApplicationError when SES rejects", () => {
  const spy = jest.spyOn(emailService.ses, "send");
  spy.mockRejectedValueOnce(new SESServiceException({ message: "some message" }));
  expect(emailService.sendEmail("foo")).rejects.toThrowError(ApplicationError);
});
