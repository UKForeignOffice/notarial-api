import { NotifyService } from "../NotifyService";
import { flattenQuestions, answersHashMap } from "../../helpers";
import { testData } from "./fixtures";

const emailService = new NotifyService();
const formFields = [{ key: "paid", type: "TextField", title: "paid", answer: true }, ...flattenQuestions(testData.questions)];

test("buildSendEmailArgs should return the correct personalisation", () => {
  const emailParams = emailService.buildSendEmailArgs(formFields, "standard", "1234");

  expect(emailParams).toEqual({
    template: "1234",
    emailAddress: "test@test.com",
    options: {
      personalisation: {
        oathType: "affirmation",
        firstName: "foo",
        post: "Istanbul Consulate General",
        docsList:
          "* your UK passport\n* proof of address\n* your partner’s passport or national identity card\n* your Turkish Residence Permit if you’ve been living in Turkey for 3 months or more",
        reference: "1234",
        translationNeeded: false,
        bookingLink: "",
        country: "Turkey",
        additionalText: undefined,
      },
      reference: "1234",
    },
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
  expect(emailService.buildDocsList(fieldsMap, false)).toBe(
    `* your UK passport\n* proof of address\n* your partner’s passport or national identity card\n* your decree absolute\n* religious book of your faith to swear upon\n* the equivalent of £50 in the local currency\n* your Turkish Residence Permit if you’ve been living in Turkey for 3 months or more`
  );
});
