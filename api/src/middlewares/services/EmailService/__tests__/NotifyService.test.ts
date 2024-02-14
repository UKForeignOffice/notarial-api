import { NotifyService } from "../NotifyService";
import { flattenQuestions, answersHashMap } from "../../helpers";
import { testData } from "./fixtures";

import "pg-boss";
import { buildUserConfirmationDocsList, PersonalisationBuilder } from "../PersonalisationBuilder";

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
  const personalisation = PersonalisationBuilder.userConfirmation(answers, { reference: "1234" });
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

test("buildDocsList will add optional documents when the relevant fields are filled in", () => {
  const answers = answersHashMap(formFields);
  const fieldsMap = {
    ...answers,
    marriedBefore: true,
    maritalStatus: "Divorced",
    oathType: "affidavit",
  };
  expect(buildUserConfirmationDocsList(fieldsMap, false)).toBe(
    `* your UK passport\n* proof of address\n* your partner’s passport or national identity card\n* your decree absolute\n* religious book of your faith to swear upon\n* the equivalent of £50 in the local currency`
  );
});
