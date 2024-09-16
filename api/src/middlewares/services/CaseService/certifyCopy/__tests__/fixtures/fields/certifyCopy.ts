import { FormField } from "../../../../../../../types/FormField";

export const certifyCopy: {
  remap: FormField[];
  reorder: Record<string, object>;
} = {
  remap: [
    {
      key: "country",
      type: "list",
      title: "Application country",
      answer: "Vietnam",
      category: "beforeYouStart",
    },
    {
      key: "typeOfDoc",
      type: "list",
      title: "Type of document to certify",
      answer: "adult passport",
      category: "beforeYouStart",
    },
    {
      key: "thirdParty",
      type: "list",
      title: "Applying on behalf of someone else",
      answer: false,
      category: "beforeYouStart",
    },
    {
      key: "applicantPassport",
      type: "file",
      title: "Upload your UK passport",
      answer: "https://document-upload-endpoint",
      category: "documents",
    },
    {
      key: "firstName",
      type: "text",
      title: "First name",
      answer: "test",
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
      answer: "test",
      category: "applicantDetails",
    },
    {
      key: "passportNumber",
      type: "text",
      title: "Passport number",
      answer: "12345678890",
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
      answer: "1998-01-19",
      category: "applicantDetails",
    },
    {
      key: "placeOfBirth",
      type: "text",
      title: "Place of birth ",
      answer: "test",
      category: "applicantDetails",
    },
    {
      key: "sex",
      type: "list",
      title: "Male or female",
      answer: "Male",
      category: "applicantDetails",
    },
    {
      key: "passportDateOfIssue",
      type: "date",
      title: "Date of issue of passport",
      answer: "1998-01-19",
      category: "applicantDetails",
    },
    {
      key: "phoneNumber",
      type: "text",
      title: "Phone number",
      answer: "+44 1234 567809",
      category: "contact",
    },
    {
      key: "emailAddress",
      type: "text",
      title: "Email address",
      answer: "luke@cautionyourblast.com",
      category: "contact",
    },
    {
      key: "phoneNumber",
      type: "text",
      title: "Confirm phone number",
      answer: "+44 1234 567809",
      category: "contact",
    },
    {
      key: "emailAddress",
      type: "text",
      title: "Confirm email address",
      answer: "luke@cautionyourblast.com",
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
    },
  ],
  reorder: {
    information: {
      country: {
        key: "country",
        type: "list",
        title: "Application country",
        answer: "Vietnam",
        category: "beforeYouStart",
      },
      typeOfDocument: {
        key: "typeOfDoc",
        type: "list",
        title: "Type of document to certify",
        answer: "adult passport",
        category: "beforeYouStart",
      },
    },
    thirdParty: {
      key: "thirdParty",
      type: "list",
      title: "Applying on behalf of someone else",
      answer: false,
      category: "beforeYouStart",
    },
    applicantPassport: {
      key: "applicantPassport",
      type: "file",
      title: "Upload your UK passport",
      answer: "https://document-upload-endpoint",
      category: "documents",
      number: {
        key: "passportNumber",
        type: "text",
        title: "Passport number",
        answer: "12345678890",
        category: "applicantDetails",
      },
      dateOfIssue: {
        key: "passportDateOfIssue",
        type: "date",
        title: "Date of issue of passport",
        answer: "1998-01-19",
        category: "applicantDetails",
      },
    },
    applicantDetails: {
      firstName: {
        key: "firstName",
        type: "text",
        title: "First name",
        answer: "test",
        category: "applicantDetails",
      },
      middleName: {
        key: "middleName",
        type: "text",
        title: "Middle name",
        answer: null,
        category: "applicantDetails",
      },
      surname: {
        key: "surname",
        type: "text",
        title: "Surname",
        answer: "test",
        category: "applicantDetails",
      },
      sex: {
        key: "sex",
        type: "list",
        title: "Male or female",
        answer: "Male",
        category: "applicantDetails",
      },
    },
    applicantBirth: {
      countryOfBirth: {
        key: "countryOfBirth",
        type: "list",
        title: "Country of birth",
        answer: "United Kingdom",
        category: "applicantDetails",
      },
      dateOfBirth: {
        key: "dateOfBirth",
        type: "date",
        title: "Date of birth",
        answer: "1998-01-19",
        category: "applicantDetails",
      },
      placeOfBirth: {
        key: "placeOfBirth",
        type: "text",
        title: "Place of birth ",
        answer: "test",
        category: "applicantDetails",
      },
    },
    contactDetails: {
      phoneNumber: {
        key: "phoneNumber",
        type: "text",
        title: "Confirm phone number",
        answer: "+44 1234 567809",
        category: "contact",
      },
      emailAddress: {
        key: "emailAddress",
        type: "text",
        title: "Confirm email address",
        answer: "luke@cautionyourblast.com",
        category: "contact",
      },
    },
    feedbackConsent: {
      feedbackConsent: {
        key: "feedbackConsent",
        type: "list",
        title: "Can our partner contact you for feedback to help improve this service?",
        answer: false,
        category: "feedback",
      },
    },
    declaration: {
      key: "declaration",
      type: "boolean",
      title: "Declaration",
      answer: true,
      category: null,
    },
  },
};