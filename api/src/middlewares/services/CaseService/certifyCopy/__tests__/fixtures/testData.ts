export const certifyCopyTestData = {
  name: "Digital Form Builder - Runner certify-a-copy",
  questions: [
    {
      category: "beforeYouStart",
      question: "Which country or territory has asked for this document?",
      fields: [{ key: "country", title: "Application country", type: "list", answer: "Vietnam" }],
      index: 0,
    },
    {
      category: "beforeYouStart",
      question: "What type of document do you need to certify?",
      fields: [{ key: "typeOfDoc", title: "Type of document to certify", type: "list", answer: "adult passport" }],
      index: 0,
    },
    {
      category: "beforeYouStart",
      question: "Are you applying on behalf of someone else?",
      fields: [{ key: "thirdParty", title: "Applying on behalf of someone else", type: "list", answer: false }],
      index: 0,
    },
    {
      category: "documents",
      question: "Your UK passport",
      fields: [{ key: "applicantPassport", title: "Upload your UK passport", type: "file", answer: "https://document-upload-endpoint" }],
      index: 0,
    },
    {
      category: "applicantDetails",
      question: "Your full name",
      fields: [
        { key: "firstName", title: "First name", type: "text", answer: "test" },
        { key: "middleName", title: "Middle name", type: "text", answer: null },
        { key: "surname", title: "Surname", type: "text", answer: "test" },
      ],
      index: 0,
    },
    {
      category: "applicantDetails",
      question: "Your UK passport details",
      fields: [
        { key: "passportNumber", title: "Passport number", type: "text", answer: "12344556789" },
        { key: "countryOfBirth", title: "Country of birth", type: "list", answer: "United Kingdom" },
        { key: "dateOfBirth", title: "Date of birth", type: "date", answer: "1998-01-19" },
        { key: "placeOfBirth", title: "Place of birth ", type: "text", answer: "test" },
        { key: "sex", title: "Male or female", type: "list", answer: "Male" },
        { key: "passportDateOfIssue", title: "Date of issue of passport", type: "date", answer: "1998-01-19" },
      ],
      index: 0,
    },
    {
      category: "contact",
      question: "Your contact details",
      fields: [
        { key: "phoneNumber", title: "Phone number", type: "text", answer: "+44 1234 567890" },
        { key: "emailAddress", title: "Email address", type: "text", answer: "luke@cautionyourblast.com" },
      ],
      index: 0,
    },
    {
      category: "contact",
      question: "Confirm your contact details",
      fields: [
        { key: "phoneNumber", title: "Confirm phone number", type: "text", answer: "+44 1234 567890" },
        { key: "emailAddress", title: "Confirm email address", type: "text", answer: "luke@cautionyourblast.com" },
      ],
      index: 0,
    },
    {
      category: "feedback",
      question: "Feedback",
      fields: [{ key: "feedbackConsent", title: "Can our partner contact you for feedback to help improve this service?", type: "list", answer: false }],
      index: 0,
    },
    { question: "Declaration", fields: [{ key: "declaration", title: "Declaration", type: "boolean", answer: true }] },
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
