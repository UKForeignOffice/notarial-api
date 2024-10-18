export const belgiumCustomLawFields = [
  {
    key: "serviceType",
    type: "list",
    title: "Service being applied for",
    answer: "Belgium - certificate of custom law",
    category: "beforeYouStart",
  },
  {
    key: "ukPassportFile",
    type: "file",
    title: "UK passport",
    answer: "https://document-upload-endpoint",
    category: "documents",
  },
  {
    key: "firstName",
    type: "text",
    title: "First name",
    answer: "a",
    category: "applicantDetails",
  },
  {
    key: "middleName",
    type: "text",
    title: "Middle name",
    answer: null,
    category: "applicantDetails",
  },
  {
    key: "surname",
    type: "text",
    title: "Surname",
    answer: "d",
    category: "applicantDetails",
  },
  {
    key: "passportNumber",
    type: "text",
    title: "Passport number",
    answer: "123123",
    category: "applicantDetails",
  },
  {
    key: "countryOfBirth",
    type: "list",
    title: "Country of birth",
    answer: "United Kingdom",
    category: "applicantDetails",
  },
  {
    key: "dateOfBirth",
    type: "date",
    title: "Date of birth",
    answer: "2000-12-25",
    category: "applicantDetails",
  },
  {
    key: "placeOfBirth",
    type: "text",
    title: "Place of birth ",
    answer: "f",
    category: "applicantDetails",
  },
  {
    key: "passportDateOfIssue",
    type: "date",
    title: "Date of issue of passport",
    answer: "2000-12-25",
    category: "applicantDetails",
  },
  {
    key: "addressLine1",
    type: "text",
    title: "Address line 1",
    answer: "a",
    category: "delivery",
  },
  {
    key: "addressLine2",
    type: "text",
    title: "Address line 2",
    answer: "b",
    category: "delivery",
  },
  {
    key: "city",
    type: "text",
    title: "Town or city",
    answer: "c",
    category: "delivery",
  },
  {
    key: "postcode",
    type: "text",
    title: "Postcode or ZIP code",
    answer: "d",
    category: "delivery",
  },
  {
    key: "country",
    type: "list",
    title: "Country",
    answer: "United Kingdom",
    category: "delivery",
  },
  {
    key: "placeOfMarriage",
    type: "text",
    title: "Place of marriage",
    answer: "london",
  },
  {
    key: "docLanguage",
    type: "list",
    title: "Document language",
    answer: "French",
    category: "certificate",
  },
  {
    key: "birthCertFile",
    type: "file",
    title: "Birth certificate",
    answer: "https://document-upload-endpoint",
    category: "documents",
  },
  {
    key: "previouslyMarried",
    type: "list",
    title: "Applicant previously married",
    answer: true,
    category: "maritalStatus",
  },
  {
    key: "proofPrevMarriage",
    type: "file",
    title: "Upload proof your previous marriage has ended",
    answer: "https://document-upload-endpoint",
    category: "documents",
  },
  {
    key: "phoneNumber",
    type: "text",
    title: "Phone number",
    answer: "+1 23",
    category: "contact",
  },
  {
    key: "emailAddress",
    type: "text",
    title: "Email address",
    answer: "test@test.com",
    category: "contact",
  },
  {
    key: "phoneNumber",
    type: "text",
    title: "Confirm phone number",
    answer: "+1 23",
    category: "contact",
  },
  {
    key: "emailAddress",
    type: "text",
    title: "Confirm email address",
    answer: "test@test.com",
    category: "contact",
  },
  {
    key: "feedbackConsent",
    type: "list",
    title: "Can our partner contact you for feedback to help improve this service?",
    answer: false,
    category: "feedback",
  },
  {
    key: "declaration",
    type: "boolean",
    title: "Declaration",
    answer: true,
    category: null,
  },
];
