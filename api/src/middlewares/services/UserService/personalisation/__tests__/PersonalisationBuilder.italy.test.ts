import "pg-boss";
import { testData } from "./fixtures";
import { answersHashMap, flattenQuestions } from "../../../helpers";
import { PersonalisationBuilder } from "../PersonalisationBuilder";
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

describe("buildSendEmailArgs for Italy", () => {
  test("when the user's partner has been married before", () => {
    const italyAnswers = {
      ...answers,
      country: "Italy",
      partnerMaritalStatus: "Divorced",
    };
    const personalisation = PersonalisationBuilder.userPostalConfirmation(italyAnswers, { reference: "1234" });
    expect(personalisation.additionalDocs).toEqual([
      "your parents’ full names",
      "original proof of address or a certified copy if your permanent address is outside Italy",
      "the document that proves any previous marriages or civil partnerships hav ended",
    ]);
  });
  test("when the user lives in Italy", () => {
    const italyAnswers = {
      ...answers,
      country: "Italy",
      partnerMaritalStatus: "Never married",
      livesInCountry: true,
    };
    const personalisation = PersonalisationBuilder.userPostalConfirmation(italyAnswers, { reference: "1234" });
    expect(personalisation.additionalDocs).toEqual(["your parents’ full names", "original proof of address or a certified copy you live in Italy"]);
  });
  test("when the user does not live in Italy", () => {
    const italyAnswers = {
      ...answers,
      country: "Italy",
      partnerMaritalStatus: "Never married",
      livesInCountry: false,
    };
    const personalisation = PersonalisationBuilder.userPostalConfirmation(italyAnswers, { reference: "1234" });
    expect(personalisation.additionalDocs).toEqual([
      "your parents’ full names",
      "original proof of address or a certified copy if your permanent address is outside Italy",
    ]);
  });
});
