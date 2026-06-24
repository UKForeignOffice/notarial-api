export const consularLetterTestData = {
  name: "Digital Form Builder - Runner letter-to-release-a-body-thailand",
  questions: [
    {
      category: "checkBeforeYouStart",
      question: "Are you the next of kin of the person who died?",
      fields: [{ key: "nextOfKin", title: "Next of kin", type: "list", answer: false }],
    },
    {
      category: "checkBeforeYouStart",
      question: "Have you been appointed by the next of kin to make funeral arrangements?",
      fields: [{ key: "isAppointedByNok", title: "Applicant is funeral director", type: "list", answer: true }],
    },
    {
      category: "documents",
      question: "Do you have the UK passport of the person who died?",
      fields: [{ key: "hasDeceasedsPassport", title: "Passport of person who died", type: "list", answer: true }],
    },
    {
      category: "documents",
      question: "The person who died's UK passport",
      fields: [{ key: "deceasedPassport", title: "UK passport of person who died", type: "file", answer: "https://document-upload-endpoint" }],
    },
    {
      category: "documents",
      question: "Proof of death",
      fields: [{ key: "deceasedProofOfDeath", title: "Proof of death", type: "file", answer: "https://document-upload-endpoint" }],
    },
    {
      category: "documents",
      question: "Next of kin's passport",
      fields: [{ key: "deaceasedsPassport", title: "Passport of the next of kin", type: "file", answer: "https://document-upload-endpoint" }],
    },
    {
      category: "documents",
      question: "Next of kin's proof of relationship",
      fields: [{ key: "proofOfRelationship", title: "Proof of relationship of next of kin", type: "file", answer: "https://document-upload-endpoint" }],
    },
    {
      category: "documents",
      question: "Written authorisation",
      fields: [{ key: "writtenAuthorisation", title: "Written authorisation", type: "file", answer: "https://document-upload-endpoint" }],
    },
    {
      category: "nextOfKinDetails",
      question: "Next of kin's full name",
      fields: [
        { key: "firstName", title: "First name", type: "text", answer: "test" },
        { key: "middleName", title: "Middle name", type: "text", answer: null },
        { key: "surname", title: "Surname", type: "text", answer: "tes" },
      ],
    },
    {
      category: "nextOfKinDetails",
      question: "What is the next of kin's relationship to the person who died?",
      fields: [{ key: "relationshipToDeceased", title: "Relationship of next of kin", type: "list", answer: "Other" }],
    },
    {
      category: "nextOfKinDetails",
      question: "Enter the next of kin's relationship to the person who died",
      fields: [{ key: "relationshipToDeceasedOther", title: "Relationship to deceased if other", type: "text", answer: "test" }],
    },
    {
      category: "nextOfKinDetails",
      question: "Next of kin's passport number",
      fields: [{ key: "travelPassportNo", title: "Passport number of the next of kin", type: "text", answer: "1234567899" }],
    },
    {
      category: "nextOfKinDetails",
      question: "Next of kin's contact details",
      fields: [
        { key: "emailAddress", title: "Email address of the next of kin", type: "text", answer: "test@test.com" },
        { key: "phoneNumber", title: "Phone number of the next of kin", type: "text", answer: "+44 1234 567890" },
      ],
    },
    {
      category: "nextOfKinDetails",
      question: "Confirm their contact details",
      fields: [
        { key: "emailAddress", title: "Email address of the next of kin", type: "text", answer: "test@test.com" },
        { key: "phoneNumber", title: "Phone number of the next of kin", type: "text", answer: "+44 1234 567890" },
      ],
    },
    {
      category: "yourDetails",
      question: "Company address",
      fields: [
        { key: "funeralDirectorCompanyName", title: "Company name", type: "text", answer: "test" },
        { key: "funeralDirectorAddressLine1", title: "Address line 1", type: "text", answer: "test" },
        { key: "funeralDirectorAddressLine2", title: "Address line 2", type: "text", answer: null },
        { key: "funeralDirectorAddressLine3", title: "Address line 3", type: "text", answer: null },
        { key: "funeralDirectorTownOrCity", title: "Town or city", type: "text", answer: "test" },
        { key: "funeralDirectorPostcode", title: "Zip or postcode", type: "text", answer: null },
      ],
    },
    {
      category: "deceasedsDetails",
      question: "The person who died's full name",
      fields: [
        { key: "deceasedFirstName", title: "First name", type: "text", answer: "test" },
        { key: "deceasedMiddleName", title: "Middle name", type: "text", answer: null },
        { key: "deceasedSurname", title: "Surname", type: "text", answer: "test" },
      ],
    },
    {
      category: "deceasedsDetails",
      question: "The person who died's passport details",
      fields: [
        { key: "deceasedPassportNumber", title: "Passport number", type: "text", answer: "123456780" },
        { key: "deceasedDateOfBirth", title: "Date of birth", type: "date", answer: "1998-01-19" },
      ],
    },
    {
      category: "deceasedsDetails",
      question: "Place and date of death",
      fields: [
        { key: "deceasedPlaceOfDeath", title: "Province", type: "list", answer: "Phuket Province" },
        { key: "deceasedDateOfDeath", title: "Date of death", type: "date", answer: "1998-01-19" },
      ],
    },
    {
      category: "delivery",
      question: "Do you need the letter within 3 working days?",
      fields: [{ key: "letterChoice", title: "How to receive consular letter", type: "list", answer: "Post" }],
    },
    {
      category: "delivery",
      question: "Postal address",
      fields: [
        { key: "addressLine1", title: "Address line 1", type: "text", answer: "test" },
        { key: "addressLine2", title: "Address line 2", type: "text", answer: null },
        { key: "addressLine3", title: "Address line 3", type: "text", answer: null },
        { key: "townOrCity", title: "Town or city", type: "text", answer: "test" },
        { key: "postcode", title: "ZIP or Postcode", type: "text", answer: "test" },
      ],
    },
    {
      category: "feedback",
      question: "Feedback",
      fields: [{ key: "feedbackConsent", title: "Can our partner contact you for feedback to help improve this service?", type: "list", answer: false }],
    },
  ],
  fees: {
    details: [{ description: "Preparing a document (fee 2 – non-refundable)", amount: 5000 }],
    total: 5000,
    prefixes: [],
    referenceFormat: "",
    reportingColumns: {},
    paymentReference: "S7E001HFZL",
  },
  metadata: {
    type: "consularLetter",
    paymentSkipped: false,
    pay: { payId: "hp6nl85nng2ftta309pslme3pf", reference: "S7E001HFZL", state: { status: "success", finished: true } },
  },
};
