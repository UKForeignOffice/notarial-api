export const testData = {
  name: "Digital Form Builder - Runner affirmation",
  questions: [
    {
      category: "beforeYouStart",
      question: "Select the country you're getting married in",
      fields: [{ key: "country", title: "Country", type: "list", answer: "Turkey" }],
    },
    {
      category: "beforeYouStart",
      question: "Do you want to certify your UK passport?",
      fields: [{ key: "certifyPassport", title: "Do you want to certify your passport as part of your affirmation application?", type: "list", answer: false }],
    },
    {
      category: "appointmentLocation",
      question: "Select a British embassy or consulate in Turkey",
      fields: [{ key: "post", title: "Select a location", type: "list", answer: "British Consulate General Istanbul" }],
    },
    {
      category: "marriage",
      question: "Place and date of marriage registration",
      fields: [
        { key: "placeOfMarriage", title: "Place of marriage", type: "text", answer: "Bodrum" },
        { key: "dateOfMarriage", title: "Date of marriage", type: "monthYear", answer: "2024-02" },
      ],
    },
    {
      category: "nameChange",
      question: "Have you ever changed your name?",
      fields: [{ key: "nameChanged", title: "Name changed", type: "list", answer: "false" }],
    },
    {
      category: "maritalStatus",
      question: "What is your marital or registered civil partnership status?",
      fields: [{ key: "maritalStatus", title: "Marital status", type: "list", answer: "Never married" }],
    },
    {
      category: "applicantDetails",
      question: "Your UK passport",
      fields: [{ key: "ukPassportFile", title: "UK passport", type: "file", answer: "https://document-upload-endpoint" }],
    },
    {
      category: "applicantDetails",
      question: "Your full name",
      fields: [
        { key: "firstName", title: "First name", type: "text", answer: "foo" },
        { key: "middleName", title: "Middle name", type: "text", answer: null },
        { key: "surname", title: "Surname", type: "text", answer: "bar" },
      ],
    },
    {
      category: "applicantDetails",
      question: "Your UK passport details",
      fields: [
        { key: "passportNumber", title: "Passport number", type: "text", answer: "123456789" },
        { key: "countryOfBirth", title: "Country of birth", type: "list", answer: "United Kingdom" },
        { key: "dateOfBirth", title: "Date of birth", type: "date", answer: "1998-01-19" },
        { key: "placeOfBirth", title: "Place of birth ", type: "text", answer: "test" },
        { key: "sex", title: "Male or female", type: "list", answer: "Male" },
        { key: "passportDateOfIssue", title: "Date of issue of passport", type: "date", answer: "1998-01-19" },
      ],
    },
    {
      category: "applicantDetails",
      question: "Your proof of address",
      fields: [{ key: "proofOfAddressFile", title: "Proof of address", type: "file", answer: "https://document-upload-endpoint" }],
    },
    {
      category: "applicantDetails",
      question: "Your address",
      fields: [
        { key: "addressLine1", title: "Address line 1", type: "text", answer: "test" },
        { key: "addressLine2", title: "Address line 2 ", type: "text", answer: null },
        { key: "city", title: "Town or city", type: "text", answer: "test" },
        { key: "postcode", title: "Postcode or zip code", type: "text", answer: null },
        { key: "countryAddress", title: "Country", type: "list", answer: "United Kingdom" },
      ],
    },
    {
      category: "partner",
      question: "Your partner's passport or national identity card",
      fields: [{ key: "partnerPassportFile", title: "Partner's passport or identity card", type: "file", answer: "https://document-upload-endpoint" }],
    },
    {
      category: "partner",
      question: "Your partner's name and nationality",
      fields: [
        { key: "partnerFirstName", title: "Partner's first name", type: "text", answer: "test" },
        { key: "partnerMiddleName", title: "Partner's middle name", type: "text", answer: null },
        { key: "partnerSurname", title: "Partner's surname", type: "text", answer: "test" },
        { key: "partnerNationality", title: "Partner's nationality ", type: "text", answer: "test" },
      ],
    },
    {
      category: "partner",
      question: "Your partner's address",
      fields: [
        { key: "partnerAddressLine1", title: "Address line 1", type: "text", answer: "test" },
        { key: "partnerAddressLine2", title: "Address line 2", type: "text", answer: null },
        { key: "partnerAddressCity", title: "Town or city", type: "text", answer: "test" },
        { key: "partnerAddressPostcode", title: "Postcode or zip code", type: "text", answer: null },
        { key: "partnerAddressCountry", title: "Country", type: "list", answer: "United Kingdom" },
      ],
    },
    {
      category: "parents",
      question: "Your father's details",
      fields: [{ key: "fatherFullName", title: "Father's full name", type: "text", answer: "tets" }],
    },
    {
      category: "parents",
      question: "Your mother's details",
      fields: [{ key: "motherFullName", title: "Mother's full name", type: "text", answer: "test" }],
    },
    {
      category: "occupation",
      question: "Your main occupation",
      fields: [{ key: "occupation", title: "Occupation", type: "text", answer: "test" }],
    },
    {
      category: "contact",
      question: "Your contact details",
      fields: [
        { key: "phoneNumber", title: "Phone number", type: "text", answer: "+44 1234 567890" },
        { key: "emailAddress", title: "Email address", type: "text", answer: "pye@cautionyourblast.com" },
      ],
    },
    { category: "contact", question: "Confirm your contact details", fields: [] },
    {
      category: "oath",
      question: "Your oath",
      fields: [
        { key: "oathType", title: "Type of oath", type: "list", answer: "Non-religious" },
        { key: "oathTypeOther", title: "Other ", type: "text", answer: null },
      ],
    },
    {
      category: "oath",
      question: "Your affirmation document",
      fields: [{ key: "jurats", title: "Select any that apply to you", type: "list", answer: "Yes" }],
    },
    {
      category: "feedback",
      question: "Feedback",
      fields: [{ key: "feedbackConsent", title: "Can our partner contact you for feedback to help improve this service?", type: "list", answer: false }],
    },
  ],
  metadata: {
    paymentSkipped: true,
    pay: {
      payId: "some-pay-id",
      state: { status: "success", finished: true },
      reference: "DG19_IJVV6",
    },
  },
};
