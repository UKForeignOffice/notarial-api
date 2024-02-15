import { NextFunction, Request, Response, Router } from "express";
import * as formsHandlers from "../../handlers/forms";
import { validationHandler } from "../../middlewares/validate";

export const formRouter = Router();

formRouter.post("/", validationHandler, formsHandlers.post);
formRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const { submitService } = res.app.services;
  try {
    const { reference } = await submitService.submitForm(body);
    res.status(200).send({
      reference,
    });
  } catch (e) {
    next(e);
    return;
  }
});
const body = {
  fees: {
    total: 5000,
    details: [{ amount: 5000, description: "Affirmation or affidavit of Marriage (fee 4)" }],
    prefixes: [],
    referenceFormat: "",
    paymentReference: "DG19_IJVV6",
    reportingColumns: { country: "Turkey" },
  },
  name: "Prove Your Eligibility to a Foreign Government affirmation",
  metadata: {
    pay: {
      payId: "fr2uhsc4udod8oob04oq42v0sf",
      state: { status: "success", finished: true },
      reference: "DG19_IJVV6",
    },
    paymentSkipped: false,
  },
  questions: [
    {
      fields: [{ key: "country", type: "list", title: "Country", answer: "Turkey" }],
      category: "beforeYouStart",
      question: "Which country are you getting married in?",
    },
    {
      fields: [
        {
          key: "post",
          type: "list",
          title: "Select a location",
          answer: "British Consulate General Istanbul",
        },
      ],
      category: "appointmentLocation",
      question: "Select a British embassy or consulate in Turkey",
    },
    {
      fields: [
        {
          key: "placeOfMarriage",
          type: "text",
          title: "Place of marriage",
          answer: "j",
        },
        { key: "dateOfMarriage", type: "monthYear", title: "Date of marriage", answer: "2020-11" },
      ],
      category: "marriage",
      question: "Place and date of marriage registration",
    },
    {
      fields: [{ key: "nameChanged", type: "list", title: "Name changed", answer: "false" }],
      category: "nameChange",
      question: "Have you ever changed your name?",
    },
    {
      fields: [{ key: "maritalStatus", type: "list", title: "Marital status", answer: "Never married" }],
      category: "maritalStatus",
      question: "What is your marital or registered civil partnership status?",
    },
    {
      fields: [
        {
          key: "ukPassportFile",
          type: "file",
          title: "UK passport",
          answer: "https://www.cautionyourblast.com/images/cyb-logo.svg",
        },
      ],
      category: "applicantDetails",
      question: "Your UK passport",
    },
    {
      fields: [
        {
          key: "firstName",
          type: "text",
          title: "First name",
          answer: "ff",
        },
        { key: "middleName", type: "text", title: "Middle name", answer: null },
        {
          key: "surname",
          type: "text",
          title: "Surname",
          answer: "ff",
        },
      ],
      category: "applicantDetails",
      question: "Your full name",
    },
    {
      fields: [
        {
          key: "passportNumber",
          type: "text",
          title: "Passport number",
          answer: "123",
        },
        {
          key: "countryOfBirth",
          type: "list",
          title: "Country of birth",
          answer: "United Kingdom",
        },
        {
          key: "dateOfBirth",
          type: "date",
          title: "Date of birth",
          answer: "2000-12-25",
        },
        { key: "placeOfBirth", type: "text", title: "Place of birth ", answer: "london" },
        {
          key: "sex",
          type: "list",
          title: "Male or female",
          answer: "Female",
        },
        {
          key: "passportDateOfIssue",
          type: "date",
          title: "Date of issue of passport",
          answer: "2016-01-01",
        },
      ],
      category: "applicantDetails",
      question: "Your UK passport details",
    },
    {
      fields: [
        {
          key: "proofOfAddressFile",
          type: "file",
          title: "Proof of address",
          answer: "https://www.cautionyourblast.com/images/cyb-logo.svg",
        },
      ],
      category: "applicantDetails",
      question: "Your proof of address",
    },
    {
      fields: [
        {
          key: "addressLine1",
          type: "text",
          title: "Address line 1",
          answer: "aa",
        },
        { key: "addressLine2", type: "text", title: "Address line 2 ", answer: null },
        {
          key: "city",
          type: "text",
          title: "Town or city",
          answer: "dd",
        },
        {
          key: "postcode",
          type: "text",
          title: "Postcode or zip code",
          answer: null,
        },
        { key: "countryAddress", type: "list", title: "Country", answer: "United Kingdom" },
      ],
      category: "applicantDetails",
      question: "Your address",
    },
    {
      fields: [
        {
          key: "partnerPassportFile",
          type: "file",
          title: "Partner's passport or identity card",
          answer: "https://www.cautionyourblast.com/images/cyb-logo.svg",
        },
      ],
      category: "partner",
      question: "Your partner's passport or national identity card",
    },
    {
      fields: [
        {
          key: "partnerFirstName",
          type: "text",
          title: "Partner's first name",
          answer: "ff",
        },
        {
          key: "partnerMiddleName",
          type: "text",
          title: "Partner's middle name",
          answer: null,
        },
        {
          key: "partnerSurname",
          type: "text",
          title: "Partner's surname",
          answer: "dd",
        },
        {
          key: "partnerNationality",
          type: "list",
          title: "Partner's nationality",
          answer: "Citizen of the United Arab Emirates",
        },
      ],
      category: "partner",
      question: "Your partner's name and nationality",
    },
    {
      fields: [
        {
          key: "partnerAddressLine1",
          type: "text",
          title: "Address line 1",
          answer: "ff",
        },
        {
          key: "partnerAddressLine2",
          type: "text",
          title: "Address line 2",
          answer: null,
        },
        {
          key: "partnerAddressCity",
          type: "text",
          title: "Town or city",
          answer: "dd",
        },
        {
          key: "partnerAddressPostcode",
          type: "text",
          title: "Postcode or zip code",
          answer: null,
        },
        { key: "partnerAddressCountry", type: "list", title: "Country", answer: "Morocco" },
      ],
      category: "partner",
      question: "Your partner's address",
    },
    {
      fields: [{ key: "fatherFullName", type: "text", title: "Father's full name", answer: "ff" }],
      category: "parents",
      question: "Your father's details",
    },
    {
      fields: [{ key: "motherFullName", type: "text", title: "Mother's full name", answer: "dd" }],
      category: "parents",
      question: "Your mother's details",
    },
    {
      fields: [{ key: "occupation", type: "text", title: "Occupation", answer: "ff" }],
      category: "occupation",
      question: "Your main occupation",
    },
    {
      fields: [
        {
          key: "phoneNumber",
          type: "text",
          title: "Phone number",
          answer: "123",
        },
        { key: "emailAddress", type: "text", title: "Email address", answer: "jen@cautionyourblast.com" },
      ],
      category: "contact",
      question: "Your contact details",
    },
    {
      fields: [],
      category: "contact",
      question: "Confirm your contact details",
    },
    {
      fields: [{ key: "oathType", type: "list", title: "Type of oath", answer: "Non-religious" }],
      category: "oath",
      question: "Your oath",
    },
    {
      fields: [
        {
          key: "UPQLxm",
          type: "list",
          title: "Select all that apply to you ",
          answer: ["you have no additional reading or writing needs"],
        },
      ],
      category: "oath",
      question: "Your affirmation document",
    },
    {
      fields: [
        {
          key: "feedbackConsent",
          type: "list",
          title: "Can our partner contact you for feedback to help improve this service?",
          answer: false,
        },
      ],
      category: "feedback",
      question: "Feedback",
    },
  ],
};
