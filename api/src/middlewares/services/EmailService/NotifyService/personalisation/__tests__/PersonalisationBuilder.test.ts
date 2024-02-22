import "pg-boss";
import { testData } from "./fixtures";
import { answersHashMap, flattenQuestions } from "../../../../helpers";
import { PersonalisationBuilder } from "../PersonalisationBuilder";
import { buildUserConfirmationDocsList } from "../personalisationBuilder.userConfirmation";
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
    nameChangedMoreThanOnce: false,
    post: "British Consulate General Istanbul",
    reference: "1234",
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
