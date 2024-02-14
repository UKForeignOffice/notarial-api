import { NotifyService } from "../NotifyService";
import { flattenQuestions, answersHashMap } from "../../helpers";
import { testData } from "./fixtures";
import { userConfirmation } from "../templates/notify";

import "pg-boss";
import { templateBuilder } from "../TemplateService";

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

const emailService = new NotifyService();
const formFields = flattenQuestions(testData.questions);
const answers = answersHashMap(formFields);

test("buildSendEmailArgs should return the correct personalisation", () => {
  const personalisation = templateBuilder.userConfirmation(answers, { reference: "1234" });
  expect(personalisation).toEqual({
    firstName: "foo",
    docsList: "* your UK passport\n* proof of address\n* your partner’s passport or national identity card\n* the equivalent of £50 in the local currency",
    bookingLink: "https://www.book-consular-appointment.service.gov.uk/TimeSelection?location=67&service=10",
    civilPartnership: "",
    country: "Turkey",
    additionalText: "",
    localRequirements: "",
    post: "British Consulate General Istanbul",
  });
});

test("mapPersonalisationValues should return some keys as undefined if a required value is missing", () => {
  const template = userConfirmation;
  const values = {
    firstName: "Joe",
    docsList: "* Document 1\n* Document 2",
    reference: "ABC1234",
    country: "Turkey",
    bookingLink: "https://a-booking-link.com",
  };
  const mapPersonalisationValuesFunc = emailService.mapPersonalisationValues(values);
  const result = Object.entries(template).reduce(mapPersonalisationValuesFunc, {});
  expect(result["post"]).toBe(undefined);
});

test("buildDocsList will add optional documents when the relevant fields are filled in", () => {
  const answers = answersHashMap(formFields);
  const fieldsMap = {
    ...answers,
    marriedBefore: true,
    maritalStatus: "Divorced",
    oathType: "affidavit",
  };
  expect(emailService.buildDocsList(fieldsMap, false)).toBe(
    `* your UK passport\n* proof of address\n* your partner’s passport or national identity card\n* your decree absolute\n* religious book of your faith to swear upon\n* the equivalent of £50 in the local currency`
  );
});
