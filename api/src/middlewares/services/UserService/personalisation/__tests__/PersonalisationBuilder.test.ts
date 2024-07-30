import "pg-boss";
import { testData } from "./fixtures";
import { answersHashMap, flattenQuestions } from "../../../helpers";
import { PersonalisationBuilder } from "../PersonalisationBuilder";
import { getAffirmationPersonalisations, getCNIPersonalisations } from "../personalisationBuilder/userConfirmation/getAdditionalPersonalisations";
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
    additionalDocs: "",
    bookingLink: "https://www.book-consular-appointment.service.gov.uk/TimeSelection?location=67&service=13",
    civilPartnership: false,
    country: "Turkey",
    localRequirements: "",
    notPaid: true,
    post: "the British Consulate General Istanbul",
    previouslyMarried: false,
    confirmationDelay: "2 weeks",
    reference: "1234",
    religious: false,
  });
});

test("buildSendEmailArgs should return the correct personalisation for a postal email", () => {
  const personalisation = PersonalisationBuilder.userPostalConfirmation(answers, { reference: "1234" });
  expect(personalisation).toEqual({
    firstName: "foo",
    post: "the British Consulate General Istanbul",
    country: "Turkey",
    bookingLink: "https://www.book-consular-appointment.service.gov.uk/TimeSelection?location=67&service=13",
    localRequirements: "",
    civilPartnership: false,
    reference: "1234",
    postAddress: "",
    previousMarriage: false,
    italyPartnerPreviousMarriage: false,
    notPaid: true,
  });
});

test("getUserPostalConfirmationAdditionalContext returns additionalContext correctly", () => {
  expect(getUserPostalConfirmationAdditionalContext("Italy")).toStrictEqual({
    additionalDocs: ["your parents' full names ", "partner's proof any previous marriages or civil partnerships have ended"],
    bookingLink: "https://www.book-consular-appointment.service.gov.uk/TimeSelection?location=33&service=10",
    civilPartnership: true,
    cniDelivery: true,
    duration: "6 months",
    localRequirements: `\nA CNI is equivalent to a 'Nulla Osta' in Italy. \nIf you decide to apply by post, you will pay an additional fee to a notary public. ‘Ask the notary to use the 'Vera di Firma procedure’.`,
    post: "the British Embassy Rome",
    postAddress: `\nBritish Embassy Rome \nVia XX Settembre 80/a \n00187 Rome \nItaly`,
    postal: true,
  });

  expect(getUserPostalConfirmationAdditionalContext("Russia", "the British Embassy Moscow")).toStrictEqual({
    additionalDocs: [
      " A piece of paper with the Russian spelling of your full name as you want it to appear on your CNI (it needs to be consistent across all the documents you submit to the Russian authorities)",
      " if you're not a Russian resident - either your residence registration slip issued by migration authorities or the rental agreement with your name for your private accommodation in Russia ",
      "if you live in another country, you can use your migration card date-stamped by Russian border control upon your arrival as proof you arrived in Russia at least 3 days earlier",
    ],
    bookingLink: "https://www.book-consular-appointment.service.gov.uk/TimeSelection?location=132&service=10",
    civilPartnership: false,
    cniDelivery: false,
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
    cniDelivery: false,
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
});

test("getAffirmationPersonalisations returns the correct personalisations given all positive answers", () => {
  const answers = {
    maritalStatus: "Divorced",
    oathType: "Religious",
  };

  expect(getAffirmationPersonalisations(answers)).toStrictEqual({
    previouslyMarried: true,
    religious: true,
  });
});

test("getAffirmationPersonalisations returns the correct personalisations given all negative answers", () => {
  const answers = {
    maritalStatus: "Never married",
    oathType: "Non-religious",
  };

  expect(getAffirmationPersonalisations(answers)).toStrictEqual({
    previouslyMarried: false,
    religious: false,
  });
});

test("getCNIPersonalisations returns the correct personalisations given all positive answers", () => {
  const answers = {
    livesInCountry: true,
    maritalStatus: "Divorced",
    oathType: "Religious",
  };

  expect(getCNIPersonalisations(answers)).toStrictEqual({
    livesInCountry: true,
    livesAbroad: false,
    previouslyMarried: true,
    religious: true,
  });
});

test("getCNIPersonalisations returns the correct personalisations given all negative answers", () => {
  const answers = {
    livesInCountry: false,
    maritalStatus: "Never married",
    oathType: "Non-religious",
  };

  expect(getCNIPersonalisations(answers)).toStrictEqual({
    livesInCountry: false,
    livesAbroad: true,
    previouslyMarried: false,
    religious: false,
  });
});
