import { CustomerEmailService } from "../CustomerEmailService";
import { flattenQuestions } from "../../helpers/flattenQuestions";
import { testData } from "./fixtures";
import { fieldsHashMap } from "../helpers";

const notifyService = {
  send: jest.fn().mockResolvedValue({}),
};

const emailService = new CustomerEmailService({ notifyService });
const formFields = flattenQuestions(testData.questions);

test("buildEmail should return the correct personalisation", () => {
  const emailParams = emailService.buildEmail(formFields, "1234", true);

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
      },
      reference: "1234",
    },
  });
});

test("buildEmail should throw if the country name doesn't exist in the additional context", () => {
  const countryFieldIndex = formFields.findIndex((field) => field.key === "country");
  const badFields = formFields.slice(0).splice(countryFieldIndex, 1, {
    key: "country",
    title: "Country",
    type: "list",
    answer: "Iceland",
  });
  expect(() => {
    emailService.buildEmail(badFields, "1234", true);
  }).toThrow();
});

test("buildDocsList will add optional documents when the relevant fields are filled in", () => {
  const fieldsMap = {
    ...fieldsHashMap(formFields),
    marriedBefore: {
      key: "marriedBefore",
      title: "Married or CP before?",
      type: "list",
      answer: true,
    },
    maritalStatus: {
      key: "maritalStatus",
      title: "Current marital status",
      type: "list",
      answer: "Divorced",
    },
    oathType: {
      key: "oathType",
      title: "Type of oath",
      type: "list",
      answer: "affidavit",
    },
  };
  expect(emailService.buildDocsList(fieldsMap, false)).toBe(
    `* your UK passport\n* proof of address\n* your partner’s passport or national identity card\n* your decree absolute\n* religious book of your faith to swear upon\n* the equivalent of £50 in the local currency\n* your Turkish Residence Permit if you’ve been living in Turkey for 3 months or more`
  );
});
