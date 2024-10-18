import { adoptionFields, adoptionFieldsPartnerIsNotBn } from "./fields/adoption";
import { andorraMscFields } from "./fields/andorraMscFields";
import { thaiCitizenshipFields } from "./fields/thaiCitizenshipFields";
import { mexicoFields } from "./fields/mexicoFields";
import { belgiumCustomLawFields } from "./fields/belgiumFields";

export const data = {
  data: {
    fees: {
      total: 5000,
      details: [{ amount: 5000, description: "Preparing a document (fee 2 – non-refundable)" }],
      prefixes: [],
      referenceFormat: "",
      paymentReference: "_VJCIIXR3-",
      reportingColumns: { serviceType: "USA - J1 visa no objection statement" },
    },
    name: "Prove Your Eligibility to a Foreign Government request-a-document",
    metadata: {
      pay: { payId: "0qpo2craa5esn49rm7khei4sti", state: { status: "success", finished: true }, reference: "_VJCIIXR3-" },
      type: "requestDocument",
      paymentSkipped: false,
    },
    questions: [
      {
        index: 0,
        fields: [{ key: "serviceType", type: "list", title: "Service being applied for", answer: "USA - J1 visa no objection statement" }],
        category: "beforeYouStart",
        question: "What service are you applying for?",
      },
      {
        index: 0,
        fields: [
          { key: "ukPassportFile", type: "file", title: "UK passport", answer: "http://documentupload:9000/v1/files/e95a22c4-6dd7-41b1-98cb-61685f508969.jpg" },
        ],
        category: "documents",
        question: "Your UK passport",
      },
      {
        index: 0,
        fields: [
          { key: "firstName", type: "text", title: "First name", answer: "George" },
          { key: "middleName", type: "text", title: "Middle name", answer: "G" },
          { key: "surname", type: "text", title: "Surname", answer: "Goofy" },
        ],
        category: "applicantDetails",
        question: "Your full name",
      },
      {
        index: 0,
        fields: [
          { key: "passportNumber", type: "text", title: "Passport number", answer: "123123" },
          { key: "countryOfBirth", type: "list", title: "Country of birth", answer: "United Kingdom" },
          { key: "dateOfBirth", type: "date", title: "Date of birth", answer: "2000-12-25" },
          { key: "placeOfBirth", type: "text", title: "Place of birth ", answer: "london" },
          { key: "passportDateOfIssue", type: "date", title: "Date of issue of passport", answer: "2000-12-25" },
        ],
        category: "applicantDetails",
        question: "Your UK passport details",
      },
      {
        index: 0,
        fields: [
          {
            key: "applicationForm",
            type: "file",
            title: "Upload your application form",
            answer: "http://documentupload:9000/v1/files/a",
          },
        ],
        category: "documents",
        question: "Your application form",
      },
      {
        index: 0,
        fields: [
          {
            key: "thirdPartyBarcode",
            type: "file",
            title: "Upload your third party barcode page",
            answer: "http://documentupload:9000/v1/files/b",
          },
        ],
        category: "documents",
        question: "Your third party barcode page",
      },
      {
        index: 0,
        fields: [
          { key: "phoneNumber", type: "text", title: "Phone number", answer: "+1 23" },
          { key: "emailAddress", type: "text", title: "Email address", answer: "test@test.com" },
        ],
        category: "contact",
        question: "Your contact details",
      },
      {
        index: 0,
        fields: [
          { key: "phoneNumber", type: "text", title: "Confirm phone number", answer: "+1 23" },
          { key: "emailAddress", type: "text", title: "Confirm email address", answer: "test@test.com" },
        ],
        category: "contact",
        question: "Confirm your contact details",
      },
      {
        index: 0,
        fields: [{ key: "feedbackConsent", type: "list", title: "Can our partner contact you for feedback to help improve this service?", answer: false }],
        category: "feedback",
        question: "Feedback",
      },
      { fields: [{ key: "declaration", type: "boolean", title: "Declaration", answer: true }], category: null, question: "Declaration" },
    ],
  },
  webhook_url: "",
};

export const fields = {
  adoption: { adoptionFields, adoptionFieldsPartnerIsNotBn },
  andorraMsc: andorraMscFields,
  thaiCitizenship: thaiCitizenshipFields,
  belgiumCustomLaw: belgiumCustomLawFields,
  mexico: mexicoFields,
};
