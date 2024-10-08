import { FormField } from "../../../../../../../types/FormField";

export const msc: {
  remap: FormField[];
  reorder: Record<string, object>;
} = {
  remap: [
    {
      key: "country",
      title: "Country",
      type: "list",
      answer: "Spain",
      category: "marriage",
    },
    {
      key: "service",
      title: "Service being applied for",
      type: "list",
      answer: "msc",
      category: "documents",
    },
    {
      key: "placeOfMarriage",
      title: "Place of marriage",
      type: "text",
      answer: "test",
      category: "marriage",
    },
    {
      key: "dateOfMarriage",
      title: "Date of marriage",
      type: "monthYear",
      answer: "2023-10",
      category: "marriage",
    },
    {
      key: "firstName",
      title: "First name",
      type: "text",
      answer: "test",
      category: "applicantDetails",
    },
    {
      key: "middleName",
      title: "Middle name",
      type: "text",
      answer: null,
      category: "applicantDetails",
    },
    {
      key: "surname",
      title: "Surname",
      type: "text",
      answer: "test",
      category: "applicantDetails",
    },
    {
      key: "affirmationFile",
      title: "Affirmation",
      type: "file",
      answer: "https://document-upload-endpoint",
      category: "documents",
    },
    {
      key: "ukPassportFile",
      title: "UK passport ",
      type: "file",
      answer: "https://document-upload-endpoint",
      category: "documents",
    },
    {
      key: "passportNumber",
      title: "Passport number",
      type: "text",
      answer: "1234567890",
      category: "applicantDetails",
    },
    {
      key: "countryOfBirth",
      title: "Country of birth",
      type: "list",
      answer: "United Kingdom",
      category: "applicantDetails",
    },
    {
      key: "dateOfBirth",
      title: "Date of birth",
      type: "date",
      answer: "1998-01-19",
      category: "applicantDetails",
    },
    {
      key: "placeOfBirth",
      title: "Place of birth ",
      type: "text",
      answer: "test",
      category: "applicantDetails",
    },
    {
      key: "sex",
      title: "Male or female",
      type: "list",
      answer: "Male",
      category: "applicantDetails",
    },
    {
      key: "passportDateOfIssue",
      title: "Date of issue of passport",
      type: "date",
      answer: "1998-01-19",
      category: "applicantDetails",
    },
    {
      key: "maritalStatus",
      title: "Marital status",
      type: "list",
      answer: "Never married",
      category: "maritalStatus",
    },
    {
      key: "livesInCountry",
      title: "Lives in the country",
      type: "list",
      answer: true,
      category: "applicantDetails",
    },
    {
      key: "proofOfAddressFile",
      title: "Proof of address ",
      type: "file",
      answer: "https://document-upload-endpoint",
      category: "documents",
    },
    {
      key: "motherFullName",
      title: "Mother's full name",
      type: "text",
      answer: "test",
    },
    {
      key: "motherMaidenName",
      title: "Maiden name",
      type: "text",
      answer: "test",
    },
    {
      key: "fatherFullName",
      title: "Father's full name",
      type: "text",
      answer: "test",
    },
    {
      key: "phoneNumber",
      title: "Phone number",
      type: "text",
      answer: "+44 12345678900",
      category: "contact",
    },
    {
      key: "emailAddress",
      title: "Email address",
      type: "text",
      answer: "luke@cautionyourblast.com",
      category: "contact",
    },
    {
      key: "feedbackConsent",
      title: "Can our partner contact you for feedback to help improve this service?",
      type: "list",
      answer: false,
      category: "feedback",
    },
    {
      key: "declaration",
      title: "Declaration",
      type: "boolean",
      answer: true,
    },
  ],
  reorder: {
    information: {
      country: {
        key: "country",
        type: "list",
        title: "Country",
        answer: "Spain",
        category: "marriage",
      },
    },
    service: {
      key: "service",
      type: "list",
      title: "Service being applied for",
      answer: "msc",
      category: "documents",
    },
    marriageDetails: {
      placeOfMarriage: {
        key: "placeOfMarriage",
        type: "text",
        title: "Place of marriage",
        answer: "test",
        category: "marriage",
      },
      dateOfMarriage: {
        key: "dateOfMarriage",
        type: "monthYear",
        title: "Date of marriage",
        answer: "2023-10",
        category: "marriage",
      },
    },
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
    applicantPassport: {
      number: {
        key: "passportNumber",
        type: "text",
        title: "Passport number",
        answer: "1234567890",
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
    countryOfBirth: {
      key: "countryOfBirth",
      type: "list",
      title: "Country of birth",
      answer: "United Kingdom",
      category: "applicantDetails",
    },
    applicantDetails: {
      dateOfBirth: {
        key: "dateOfBirth",
        type: "date",
        title: "Date of birth",
        answer: "1998-01-19",
        category: "applicantDetails",
      },
      sex: {
        key: "sex",
        type: "list",
        title: "Male or female",
        answer: "Male",
        category: "applicantDetails",
      },
      phoneNumber: {
        key: "phoneNumber",
        type: "text",
        title: "Phone number",
        answer: "+44 12345678900",
        category: "contact",
      },
      emailAddress: {
        key: "emailAddress",
        type: "text",
        title: "Email address",
        answer: "luke@cautionyourblast.com",
        category: "contact",
      },
    },
    placeOfBirth: {
      key: "placeOfBirth",
      type: "text",
      title: "Place of birth ",
      answer: "test",
      category: "applicantDetails",
    },
    maritalStatus: {
      status: {
        key: "maritalStatus",
        type: "list",
        title: "Marital status",
        answer: "Never married",
        category: "maritalStatus",
      },
    },
    livesInCountry: {
      key: "livesInCountry",
      type: "list",
      title: "Lives in the country",
      answer: true,
      category: "applicantDetails",
    },
    motherFullName: {
      key: "motherFullName",
      type: "text",
      title: "Mother's full name",
      answer: "test",
    },
    motherMaidenName: {
      key: "motherMaidenName",
      type: "text",
      title: "Maiden name",
      answer: "test",
    },
    fatherFullName: {
      key: "fatherFullName",
      type: "text",
      title: "Father's full name",
      answer: "test",
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
