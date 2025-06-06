export const adoptionFields = [
  {
    key: "serviceType",
    type: "list",
    title: "Service being applied for",
    answer: "letter of no objection to adopt a child",
    category: "beforeYouStart",
  },
  {
    key: "applicationCountry",
    type: "list",
    title: "Country being applied to",
    answer: "India",
    category: "beforeYouStart",
  },
  {
    key: "post",
    type: "list",
    title: "Select a location",
    answer: "the British Deputy High Commission Chandigarh",
    category: "appointmentLocation",
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
    answer: "b",
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
    key: "swornStatement",
    type: "file",
    title: "Upload your sworn statement",
    answer: "https://document-upload-endpoint",
    category: "documents",
  },
  {
    key: "partnerIsBN",
    type: "list",
    title: "Partner is a British National",
    answer: true,
    category: "partnerDetails",
  },
  {
    key: "partnersSwornStatement",
    type: "file",
    title: "Upload your partner's sworn statement",
    answer: "https://document-upload-endpoint",
    category: "documents",
  },
  {
    key: "partnerUkPassportFile",
    type: "file",
    title: "Upload your partner's UK passport",
    answer: "https://document-upload-endpoint",
    category: "documents",
  },
  {
    key: "partnerFirstName",
    type: "text",
    title: "First name",
    answer: "partner-first",
    category: "partnerDetails",
  },
  {
    key: "partnerMiddleName",
    type: "text",
    title: "Middle name",
    answer: null,
    category: "partnerDetails",
  },
  {
    key: "partnerSurname",
    type: "text",
    title: "Surname",
    answer: "partner-sur",
    category: "partnerDetails",
  },
  {
    key: "partnerPassportNumber",
    type: "text",
    title: "Passport number",
    answer: "987987",
    category: "partnerDetails",
  },
  {
    key: "partnerCountryOfBirth",
    type: "list",
    title: "Country of birth",
    answer: "United Kingdom",
    category: "partnerDetails",
  },
  {
    key: "partnerDateOfBirth",
    type: "date",
    title: "Date of birth",
    answer: "2000-01-01",
    category: "partnerDetails",
  },
  {
    key: "partnerPlaceOfBirth",
    type: "text",
    title: "Place of birth",
    answer: "london",
    category: "partnerDetails",
  },
  {
    key: "partnerPassportDateOfIssue",
    type: "date",
    title: "Date of issue of passport",
    answer: "2015-01-01",
    category: "partnerDetails",
  },
  {
    key: "phoneNumber",
    type: "text",
    title: "Phone number",
    answer: "+1 23123",
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
    answer: "+1 23123",
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
    answer: true,
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
export const adoptionFieldsPartnerIsNotBn = [
  {
    key: "serviceType",
    type: "list",
    title: "Service being applied for",
    answer: "letter of no objection to adopt a child",
    category: "beforeYouStart",
  },
  {
    key: "applicationCountry",
    type: "list",
    title: "Country being applied to",
    answer: "India",
    category: "beforeYouStart",
  },
  {
    key: "post",
    type: "list",
    title: "Select a location",
    answer: "the British Deputy High Commission Chandigarh",
    category: "appointmentLocation",
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
    answer: "b",
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
    key: "swornStatement",
    type: "file",
    title: "Upload your sworn statement",
    answer: "https://document-upload-endpoint",
    category: "documents",
  },
  {
    key: "partnerIsBN",
    type: "list",
    title: "Partner is a British National",
    answer: false,
    category: "partnerDetails",
  },
  {
    key: "phoneNumber",
    type: "text",
    title: "Phone number",
    answer: "+1 23123",
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
    answer: "+1 23123",
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
    answer: true,
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
