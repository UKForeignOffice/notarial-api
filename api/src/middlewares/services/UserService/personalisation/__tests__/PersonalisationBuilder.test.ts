import "pg-boss";
import { testData } from "./fixtures";
import { answersHashMap, flattenQuestions } from "../../../helpers";
import { PersonalisationBuilder } from "../PersonalisationBuilder";
import { buildUserConfirmationDocsList } from "../personalisationBuilder.userConfirmation";
import { buildUserPostalConfirmationPersonalisation, getUserPostalConfirmationAdditionalContext } from "../personalisationBuilder.userPostalConfirmation";
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

test("buildSendEmailArgs should return the correct personalisation for an in-person email", () => {
  const personalisation = PersonalisationBuilder.userConfirmation(answers, { type: "affirmation", reference: "1234" });
  expect(personalisation).toEqual({
    firstName: "foo",
    docsList:
      "* your UK passport\n* your birth certificate\n* proof of address – you must use your residence permit if the country you live in issues these\n* your partner’s passport or national identity card",
    bookingLink: "https://www.book-consular-appointment.service.gov.uk/TimeSelection?location=67&service=10",
    civilPartnership: false,
    country: "Turkey",
    localRequirements: "",
    notPaid: true,
    post: "the British Consulate General Istanbul",
    confirmationDelay: "2 weeks",
    reference: "1234",
  });
});

test("buildSendEmailArgs should return the correct personalisation for a postal email", () => {
  const personalisation = PersonalisationBuilder.userPostalConfirmation(answers, { reference: "1234" });
  expect(personalisation).toEqual({
    firstName: "foo",
    post: "the British Consulate General Istanbul",
    country: "Turkey",
    bookingLink: "https://www.book-consular-appointment.service.gov.uk/TimeSelection?location=67&service=10",
    localRequirements: "",
    civilPartnership: false,
    reference: "1234",
    postAddress: "",
    previousMarriage: false,
    notPaid: true,
  });
});

test("getUserPostalConfirmationAdditionalContext returns additionalContext correctly", () => {
  expect(getUserPostalConfirmationAdditionalContext("Italy")).toStrictEqual({
    additionalDocs: "",
    bookingLink: "https://www.book-consular-appointment.service.gov.uk/TimeSelection?location=33&service=10",
    civilPartnership: false,
    duration: "6 months",
    localRequirements: "",
    post: "the British Embassy Rome",
    postAddress: "",
    postal: true,
  });

  expect(getUserPostalConfirmationAdditionalContext("Russia")).toStrictEqual({
    additionalDocs: [
      " A piece of paper with the Russian spelling of your full name as you want it to appear on your CNI (it needs to be consistent across all the documents you submit to the Russian authorities)",
      " if you're not a Russian resident - either your residence registration slip issued by migration authorities or the rental agreement with your name for your private accommodation in Russia",
    ],
    bookingLink: "https://www.book-consular-appointment.service.gov.uk/TimeSelection?location=132&service=10",
    civilPartnership: false,
    duration: "3 to 12 months (check with the person conducting your ceremony)",
    localRequirements: "",
    post: "the British Embassy Moscow",
    postAddress: "\nBritish Embassy Moscow \n121099 Moscow \nSmolenskaya Naberezhnaya 10",
    postal: true,
  });

  expect(getUserPostalConfirmationAdditionalContext("Poland")).toStrictEqual({
    additionalDocs: "",
    bookingLink: "https://www.book-consular-appointment.service.gov.uk/TimeSelection?location=40&service=10",
    civilPartnership: false,
    duration: "6 months",
    localRequirements:
      "\nYou can apply before you have confirmed the final place and date of your ceremony. When asked in your online application, enter the estimated date and rough location within Poland.",
    post: "the British Embassy Warsaw",
    postAddress: "\nConsular Section \nBritish Embassy \nul. Kawalerii 12 \n00-468 Warsaw \nMazowieckie",
    postal: true,
  });
});

test("buildUserPostalConfirmationPersonalisation renders countries with default posts", () => {
  let personalisation = buildUserPostalConfirmationPersonalisation({ country: "Italy" }, { reference: "1234" });
  expect(personalisation.post).toBe("the British Embassy Rome");

  personalisation = buildUserPostalConfirmationPersonalisation({ country: "Russia" }, { reference: "1234" });
  expect(personalisation.post).toBe("the British Embassy Moscow");
});

test("buildDocsList will add optional documents when the relevant fields are filled in", () => {
  const answers = answersHashMap(formFields);
  const fieldsMap = {
    ...answers,
    marriedBefore: true,
    maritalStatus: "Divorced",
    oathType: "Religious",
  };
  expect(buildUserConfirmationDocsList(fieldsMap, "affirmation")).toBe(
    `* your UK passport\n* your birth certificate\n* proof of address – you must use your residence permit if the country you live in issues these\n* your partner’s passport or national identity card\n* decree absolute\n* religious book of your faith to swear upon`
  );
});

test("buildDocsList will add cni proof of stay doc if the form type is cni", () => {
  const answers = answersHashMap(formFields);
  const fieldsMap = {
    ...answers,
    marriedBefore: false,
    oathType: "affirmation",
  };
  expect(buildUserConfirmationDocsList(fieldsMap, "cni")).toBe(
    `* your UK passport\n* proof of address – you must use your residence permit if the country you live in issues these\n* proof you’ve been staying in the country for 3 whole days before your appointment – if this is not shown on your proof of address\n* your partner’s passport or national identity card`
  );
});
