export const testData = {
  name: "Digital Form Builder - Runner affirmation",
  questions: [
    {
      category: "beforeYouStart",
      question: "Select the country you're getting married in",
      fields: [{ key: "country", title: "Country", type: "list", answer: "Turkey" }],
    },
    {
      category: "appointmentLocation",
      question: "Select a British embassy or consulate in Turkey",
      fields: [
        {
          key: "post",
          title: "Select a location",
          type: "list",
          answer: "Istanbul Consulate General",
        },
      ],
    },
    {
      category: "applicantMarriage",
      question: "Place and date of marriage registration",
      fields: [
        {
          key: "RlUFWc",
          title: "Place of marriage",
          type: "text",
          answer: "test",
        },
        {
          key: "kPGPUc",
          title: "Date of marriage",
          type: "monthYear",
          answer: "2023-10",
        },
      ],
    },
    {
      question: "Have you been married or in a civil partnership before?",
      fields: [
        {
          key: "marriedBefore",
          title: "Married or CP before?",
          type: "list",
          answer: false,
        },
      ],
    },
    {
      category: "applicantNameChange",
      question: "Have you ever changed your name?",
      fields: [
        {
          key: "nameChangedNoMarriage",
          title: "Name changed",
          type: "list",
          answer: false,
        },
      ],
    },
    {
      category: "applicantDocs",
      question: "UK passport",
      fields: [
        {
          key: "IYkNwD",
          title: "UK passport",
          type: "file",
          answer: "http://localhost:9000/v1/files/5f4759e5-58d8-4b4d-9b9b-cc17dd6fd7fb.png",
        },
      ],
    },
    {
      category: "applicantDetails",
      question: "Your full name",
      fields: [
        {
          key: "firstName",
          title: "First name",
          type: "text",
          answer: "foo",
        },
        { key: "CNAsiH", title: "Middle name", type: "text", answer: null },
        { key: "sQhPRP", title: "Surname", type: "text", answer: "bar" },
      ],
    },
    {
      category: "applicantDetails",
      question: "UK passport details",
      fields: [
        {
          key: "KfBDDG",
          title: "Passport number",
          type: "text",
          answer: "12345789",
        },
        {
          key: "llZZFF",
          title: "Country of birth",
          type: "list",
          answer: "United Kingdom",
        },
        {
          key: "iNhNMn",
          title: "Date of birth",
          type: "date",
          answer: "1998-01-19",
        },
        {
          key: "SgaocB",
          title: "Place of birth ",
          type: "text",
          answer: "test",
        },
        {
          key: "KuFQHL",
          title: "Male or female",
          type: "list",
          answer: "Male",
        },
        {
          key: "QtsMpE",
          title: "Date of issue of passport",
          type: "date",
          answer: "1998-01-19",
        },
      ],
    },
    {
      category: "applicantDocs",
      question: "Proof of address",
      fields: [
        {
          key: "tZXpuQ",
          title: "Proof of address",
          type: "file",
          answer: "http://localhost:9000/v1/files/f56f08a9-948e-4c98-8adb-78d5a3918012.jpg",
        },
      ],
    },
    {
      category: "applicantDetails",
      question: "Your address",
      fields: [
        {
          key: "ncyOTQ",
          title: "Address line 1",
          type: "text",
          answer: "test",
        },
        {
          key: "svmzHm",
          title: "Address line 2 ",
          type: "text",
          answer: null,
        },
        {
          key: "nhkPTu",
          title: "Town or city",
          type: "text",
          answer: "test",
        },
        {
          key: "NdQYWv",
          title: "Postcode or zip code",
          type: "text",
          answer: null,
        },
        {
          key: "mNwwxx",
          title: "Country",
          type: "list",
          answer: "United Kingdom",
        },
      ],
    },
    {
      category: "applicantPartner",
      question: "Partner's passport or national identity card",
      fields: [
        {
          key: "qFuyQg",
          title: "Partner's passport or identity card",
          type: "file",
          answer: "http://localhost:9000/v1/files/949de5d0-1857-4185-9f2f-c9415c804629.jpg",
        },
      ],
    },
    {
      category: "applicantPartner",
      question: "Your partner's name and nationality",
      fields: [
        {
          key: "qMwAzf",
          title: "Partner's first name",
          type: "text",
          answer: "test",
        },
        {
          key: "JtUIeu",
          title: "Partner's middle name",
          type: "text",
          answer: null,
        },
        {
          key: "EApTtB",
          title: "Partner's surname",
          type: "text",
          answer: "test",
        },
        {
          key: "WIhpEs",
          title: "Partner's nationality ",
          type: "text",
          answer: "test",
        },
      ],
    },
    {
      category: "applicantPartner",
      question: "Your partner's address",
      fields: [
        {
          key: "OusegU",
          title: "Address line 1",
          type: "text",
          answer: "test",
        },
        {
          key: "NAPApe",
          title: "Address line 2",
          type: "text",
          answer: null,
        },
        {
          key: "ntkyCg",
          title: "Town or city",
          type: "text",
          answer: "test",
        },
        {
          key: "TCEzgh",
          title: "Postcode or zip code",
          type: "text",
          answer: null,
        },
        {
          key: "JLxfVp",
          title: "Country",
          type: "list",
          answer: "United Kingdom",
        },
      ],
    },
    {
      category: "applicantDocs",
      question: "Your birth certificate",
      fields: [
        {
          key: "QzoKfc",
          title: "Birth certificate",
          type: "file",
          answer: "http://localhost:9000/v1/files/c312106c-43be-4f98-a5e4-9fb529c5caac.jpg",
        },
      ],
    },
    {
      category: "applicantParents",
      question: "Your father's details",
      fields: [
        {
          key: "AUPxcz",
          title: "Father's full name",
          type: "text",
          answer: "test",
        },
      ],
    },
    {
      category: "applicantParents",
      question: "Your mother's details",
      fields: [
        {
          key: "gnWqOi",
          title: "Mother's full name",
          type: "text",
          answer: "test",
        },
      ],
    },
    {
      category: "applicantDetails",
      question: "Your main occupation",
      fields: [{ key: "ZZHoIt", title: "Occupation", type: "text", answer: "test" }],
    },
    {
      category: "applicantDetails",
      question: "Your contact details",
      fields: [
        {
          key: "applicantPhone",
          title: "Phone number",
          type: "text",
          answer: "+44 1234 567890",
        },
        {
          key: "poVfrf",
          title: "Confirm phone number",
          type: "text",
          answer: "+44 1234 566890",
        },
        {
          key: "applicantEmail",
          title: "Email address",
          type: "text",
          answer: "test@test.com",
        },
        {
          key: "ZpAXwW",
          title: "Confirm email address",
          type: "text",
          answer: "test@test.com",
        },
      ],
    },
    {
      category: "oath",
      question: "Do you want to swear a religious or non-religious oath?",
      fields: [
        {
          key: "oathType",
          title: "Type of oath",
          type: "list",
          answer: "affirmation",
        },
      ],
    },
    {
      question: "Feedback",
      fields: [
        {
          key: "emHOVk",
          title: "Can our partner contact you for feedback to help improve this service?",
          type: "list",
          answer: false,
        },
      ],
    },
  ],
  metadata: { paymentSkipped: false },
};
