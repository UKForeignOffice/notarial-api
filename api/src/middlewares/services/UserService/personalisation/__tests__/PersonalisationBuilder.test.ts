import "pg-boss";
import { marriageTestData, certifyCopyTestData } from "./fixtures";
import { answersHashMap, flattenQuestions } from "../../../helpers";
import { MarriagePersonalisationBuilder } from "../PersonalisationBuilder/marriage/PersonalisationBuilder";
import { CertifyCopyPersonalisationBuilder } from "../PersonalisationBuilder/certifyCopy/PersonalisationBuilder";
import { buildPostalPersonalisation, getPostalAdditionalContext } from "../PersonalisationBuilder/marriage/postal";
import { getAffirmationPersonalisations, getCNIPersonalisations } from "../PersonalisationBuilder/marriage/inPerson/getAdditionalPersonalisations";
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

const marriageFormFields = flattenQuestions(marriageTestData.questions);
const marriageAnswers = answersHashMap(marriageFormFields);

const certifyCopyFormFields = flattenQuestions(certifyCopyTestData.questions);
const certifyCopyAnswers = answersHashMap(certifyCopyFormFields);

test("buildJobData should return the correct personalisation for an in-person email", () => {
  const personalisation = MarriagePersonalisationBuilder.inPerson(marriageAnswers, { type: "affirmation", reference: "1234" });
  expect(personalisation).toEqual({
    firstName: "foo",
    additionalDocs: "",
    bookingLink: "https://www.book-consular-appointment.service.gov.uk/TimeSelection?location=67&service=13",
    cabsV3BookingLink: "https://www.manage-consular-appointment.service.gov.uk/cabs/s/appointment-booking?location=67&service=13",
    civilPartnership: false,
    country: "Turkey",
    localRequirements: "",
    notPaid: true,
    post: "the British Consulate General Istanbul",
    previouslyMarried: false,
    reference: "1234",
    religious: false,
  });
});

test("buildJobData should return the correct personalisation for a postal email", () => {
  const personalisation = MarriagePersonalisationBuilder.postal(marriageAnswers, { reference: "1234", type: "cni" });
  expect(personalisation).toEqual({
    firstName: "foo",
    post: "the British Consulate General Istanbul",
    country: "Turkey",
    countryIsCroatia: false,
    countryIsItalyAndDoesNotLiveInItaly: false,
    countryIsItalyAndPartnerHadPreviousMarriage: false,
    localRequirements: "",
    civilPartnership: false,
    reference: "1234",
    postAddress: "",
    userHadPreviousMarriage: false,
    notPaid: true,
  });
});

test("buildJobData should return the correct personalisation for Spain when the user's partner has been married before", () => {
  const spainAnswers = {
    ...marriageAnswers,
    country: "Spain",
    partnerMaritalStatus: "Divorced",
    livesInCountry: true,
  };
  const personalisation = MarriagePersonalisationBuilder.postal(spainAnswers, { reference: "1234", type: "cni" });
  expect(personalisation).toEqual({
    firstName: "foo",
    post: "the British Consulate General Istanbul",
    country: "Spain",
    countryIsCroatia: false,
    countryIsItalyAndDoesNotLiveInItaly: false,
    countryIsItalyAndPartnerHadPreviousMarriage: false,
    localRequirements:
      "\nYou must apply for your documents 3 months before your civil registry appointment, or your wedding date if you’re holding a religious ceremony first and registering the marriage at the civil registry afterwards.\nOnce the British Consulate General Madrid gets your correct documents in the post, you should get your documents within 30 working days. Your application cannot be processed any faster, even if your civil registry appointment or wedding date is closer. \nThe British Consulate General Madrid is unable to provide updates on the status of your application.",
    civilPartnership: false,
    reference: "1234",
    postAddress: "",
    userHadPreviousMarriage: false,
    notPaid: true,
  });
});

test("getPostalAdditionalContext returns additionalContext correctly", () => {
  expect(getPostalAdditionalContext("Italy", "cni")).toStrictEqual({
    additionalDocs: [
      "your parents‘ full names ",
      "partner‘s proof any previous marriages or civil partnerships have ended ",
      "proof of permanent address if you live outside of Italy",
    ],
    bookingLink: "https://www.book-consular-appointment.service.gov.uk/TimeSelection?location=33&service=10",
    civilPartnership: true,
    cniDelivery: true,
    duration: "6 months",
    localRequirements: `\nA CNI is equivalent to a ‘Nulla Osta’ in Italy.`,
    post: "the British Embassy Rome",
    postAddress: `\nBritish Embassy Rome \nVia XX Settembre 80/a \n00187 Rome \nItaly`,
    postal: true,
  });

  expect(getPostalAdditionalContext("Russia", "the British Embassy Moscow")).toStrictEqual({
    additionalDocs: [
      "a piece of paper with the Russian spelling of your full name as you want it to appear on your CNI (it needs to be consistent across all the documents you submit to the Russian authorities)",
    ],
    bookingLink: "https://www.book-consular-appointment.service.gov.uk/TimeSelection?location=132&service=10",
    civilPartnership: false,
    cniDelivery: false,
    duration: "3 to 12 months (check with the person conducting your ceremony)",
    localRequirements: "",
    post: "the British Embassy Moscow",
    postAddress: "\nBritish Embassy Moscow \n121099 Moscow \nLuhansk People’s Republic Square 1 \n \n(for postal purposes only)",
    postal: true,
  });

  expect(getPostalAdditionalContext("Poland", "cni")).toStrictEqual({
    additionalDocs: "",
    bookingLink: "https://www.book-consular-appointment.service.gov.uk/TimeSelection?location=40&service=10",
    civilPartnership: false,
    cniDelivery: true,
    duration: "6 months",
    localRequirements: "",
    post: "the British Embassy Warsaw",
    postAddress: "\nConsular Section \nBritish Embassy \nul. Kawalerii 12 \n00-468 Warsaw \nMazowieckie",
    postal: true,
  });
});

test("buildPostalPersonalisation returns correct personalisations for msc", () => {
  let personalisation = buildPostalPersonalisation({ country: "Spain" }, { reference: "1234", type: "msc" });
  expect(personalisation.countryIsCroatia).toBe(undefined);
  expect(personalisation.livesInCountry).toBe(undefined);
});

test("buildPostalPersonalisation returns correct personalisations for cni and msc", () => {
  let personalisation = buildPostalPersonalisation(
    { country: "Spain", livesInCountry: true, partnerMaritalStatus: "Never married" },
    { reference: "1234", type: "cniAndMsc" }
  );
  expect(personalisation.livesInCountry).toBe(true);
  expect(personalisation.livesOutsideApplicationCountry).toBe(false);
});

test("buildPostalPersonalisation renders countries with default posts", () => {
  let personalisation = buildPostalPersonalisation({ country: "Italy" }, { reference: "1234", type: "cni" });
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
    certRequired: true,
    country: "Italy",
  };

  expect(getCNIPersonalisations(answers)).toStrictEqual({
    croatiaCertNeeded: true,
    livesInCountry: true,
    livesAbroad: false,
    previouslyMarried: true,
    religious: true,
    countryIsItaly: true,
  });
});

test("getCNIPersonalisations returns the correct personalisations given all negative answers", () => {
  const answers = {
    livesInCountry: false,
    maritalStatus: "Never married",
    oathType: "Non-religious",
    certRequired: false,
    country: "Croatia",
  };

  expect(getCNIPersonalisations(answers)).toStrictEqual({
    croatiaCertNeeded: false,
    livesInCountry: false,
    livesAbroad: true,
    previouslyMarried: false,
    religious: false,
    countryIsItaly: false,
  });
});

test("buildJobData should return the correct personalisation for a certify a copy in-person email", () => {
  const personalisation = CertifyCopyPersonalisationBuilder.inPerson(certifyCopyAnswers, { type: "certifyCopy", reference: "1234" });

  expect(personalisation).toEqual({
    firstName: "test",
    post: "the British Embassy Bangkok",
    bookingLink: "https://www.book-consular-appointment.service.gov.uk/TimeSelection?location=53&service=9",
    reference: "1234",
  });
});

test("buildJobData should return the correct personalisation for a certify copy postal email", () => {
  const answers = {
    ...certifyCopyAnswers,
    country: "Bulgaria",
  };
  const personalisation = CertifyCopyPersonalisationBuilder.postal(answers, { type: "certifyCopy", reference: "1234" });

  expect(personalisation).toEqual({
    firstName: "test",
    post: "the British Embassy Sofia",
    reference: "1234",
    postAddress: "\nBritish Embassy Sofia\n9, Moskovska St\n1000 Sofia\nBulgaria",
  });
});
