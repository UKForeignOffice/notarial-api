import { FormField } from "../../../../../../../types/FormField";

export const exchange: {
  remap: FormField[];
  reorder: Record<string, object>;
} = {
  remap: [
    {
      key: "country",
      title: "Country",
      type: "list",
      answer: "Sweden",
      category: "marriage",
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
      answer: "2203-10",
      category: "marriage",
    },
    {
      key: "certifyPassport",
      title: "Do you want to certify your passport as part of your CNI exchange application?",
      type: "list",
      answer: true,
      category: "additionalServices",
    },
    {
      key: "ukCNIUpload",
      title: "UK CNI ",
      type: "file",
      answer: "https://document-upload-endpoint",
      category: "applicantDetails",
    },
    {
      key: "maritalStatus",
      title: "Marital status",
      type: "list",
      answer: "Never married",
      category: "applicantDetails",
    },
    {
      key: "ukPassportFile",
      title: "UK passport",
      type: "file",
      answer: "https://document-upload-endpoint",
      category: "applicantDetails",
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
      key: "addressLine1",
      title: "Address line 1",
      type: "text",
      answer: "test",
      category: "applicantDetails",
    },
    {
      key: "addressLine2",
      title: "Address line 2 ",
      type: "text",
      answer: null,
      category: "applicantDetails",
    },
    {
      key: "city",
      title: "Town or city",
      type: "text",
      answer: "test",
      category: "applicantDetails",
    },
    {
      key: "postcode",
      title: "Postcode or zip code",
      type: "text",
      answer: null,
      category: "applicantDetails",
    },
    {
      key: "countryAddress",
      title: "Country",
      type: "list",
      answer: "United Kingdom",
      category: "applicantDetails",
    },
    {
      key: "partnerMaritalStatus",
      title: "Partner’s marital status",
      type: "list",
      answer: "Never married",
      category: "partner",
    },
    {
      key: "partnerFirstName",
      title: "Partner’s first name",
      type: "text",
      answer: "test",
      category: "partner",
    },
    {
      key: "partnerMiddleName",
      title: "Partner’s middle name",
      type: "text",
      answer: null,
      category: "partner",
    },
    {
      key: "partnerSurname",
      title: "Partner’s surname",
      type: "text",
      answer: "test",
      category: "partner",
    },
    {
      key: "partnerNationality",
      title: "Partner’s nationality",
      type: "list",
      answer: "British",
      category: "partner",
    },
    {
      key: "partnerSex",
      title: "Partner’s sex",
      type: "list",
      answer: "Male",
      category: "partner",
    },
    {
      key: "partnerAddressLine1",
      title: "Address line 1",
      type: "text",
      answer: "test",
      category: "partner",
    },
    {
      key: "partnerAddressLine2",
      title: "Address line 2",
      type: "text",
      answer: null,
      category: "partner",
    },
    {
      key: "partnerAddressCity",
      title: "Town or city",
      type: "text",
      answer: "test",
      category: "partner",
    },
    {
      key: "partnerAddressPostcode",
      title: "Postcode or zip code",
      type: "text",
      answer: null,
      category: "partner",
    },
    {
      key: "partnerAddressCountry",
      title: "Country",
      type: "list",
      answer: "United Kingdom",
      category: "partner",
    },
    {
      key: "phoneNumber",
      title: "Phone number",
      type: "text",
      answer: "+44 1234 567890",
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
        answer: "Sweden",
        category: "marriage",
      },
      certifyPassport: {
        key: "certifyPassport",
        type: "list",
        title: "Do you want to certify your passport as part of your CNI exchange application?",
        answer: true,
        category: "additionalServices",
      },
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
        answer: "2203-10",
        category: "marriage",
      },
    },
    maritalStatus: {
      status: {
        key: "maritalStatus",
        type: "list",
        title: "Marital status",
        answer: "Never married",
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
      phoneNumber: {
        key: "phoneNumber",
        type: "text",
        title: "Phone number",
        answer: "+44 1234 567890",
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
    applicantAddress: {
      addressLine1: {
        key: "addressLine1",
        type: "text",
        title: "Address line 1",
        answer: "test",
        category: "applicantDetails",
      },
      addressLine2: {
        key: "addressLine2",
        type: "text",
        title: "Address line 2 ",
        answer: null,
        category: "applicantDetails",
      },
      city: {
        key: "city",
        type: "text",
        title: "Town or city",
        answer: "test",
        category: "applicantDetails",
      },
      postcode: {
        key: "postcode",
        type: "text",
        title: "Postcode or zip code",
        answer: null,
        category: "applicantDetails",
      },
      country: {
        key: "countryAddress",
        type: "list",
        title: "Country",
        answer: "United Kingdom",
        category: "applicantDetails",
      },
    },
    partnerMaritalStatus: {
      partnerMaritalStatus: {
        key: "partnerMaritalStatus",
        type: "list",
        title: "Partner’s marital status",
        answer: "Never married",
        category: "partner",
      },
    },
    partnerName: {
      partnerFirstName: {
        key: "partnerFirstName",
        type: "text",
        title: "Partner’s first name",
        answer: "test",
        category: "partner",
      },
      partnerMiddleName: {
        key: "partnerMiddleName",
        type: "text",
        title: "Partner’s middle name",
        answer: null,
        category: "partner",
      },
      partnerSurname: {
        key: "partnerSurname",
        type: "text",
        title: "Partner’s surname",
        answer: "test",
        category: "partner",
      },
      partnerSex: {
        key: "partnerSex",
        type: "list",
        title: "Partner’s sex",
        answer: "Male",
        category: "partner",
      },
    },
    partnerNationality: {
      partnerNationality: {
        key: "partnerNationality",
        type: "list",
        title: "Partner’s nationality",
        answer: "British",
        category: "partner",
      },
    },
    partnerAddress: {
      partnerAddressLine1: {
        key: "partnerAddressLine1",
        type: "text",
        title: "Address line 1",
        answer: "test",
        category: "partner",
      },
      partnerAddressLine2: {
        key: "partnerAddressLine2",
        type: "text",
        title: "Address line 2",
        answer: null,
        category: "partner",
      },
      partnerAddressCity: {
        key: "partnerAddressCity",
        type: "text",
        title: "Town or city",
        answer: "test",
        category: "partner",
      },
      partnerAddressPostcode: {
        key: "partnerAddressPostcode",
        type: "text",
        title: "Postcode or zip code",
        answer: null,
        category: "partner",
      },
      partnerAddressCountry: {
        key: "partnerAddressCountry",
        type: "list",
        title: "Country",
        answer: "United Kingdom",
        category: "partner",
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
