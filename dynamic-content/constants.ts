import { Conditions, FileConstants } from "./types";

const CONTENT_SOURCE = "./csv";
const CONTENT_TARGET = "../runner/src/server/templates/additionalContexts.json";
const BEFORE_YOU_START_FORM = "../runner/src/server/forms-v3/before-you-start.json";

const BEFORE_YOU_START_CONDITIONS: Conditions = {
  countryNotDigitised: {
    evaluateField: "type",
    evaluateValue: [""],
    useField: "country",
    defaultDisplayName: "Country not digitised",
    formField: {
      name: "country",
      displayName: "Country",
      type: "AutocompleteField",
    },
    operation: "is",
  },
  documentationNotNeeded: {
    evaluateField: "type",
    evaluateValue: ["commonwealth", "none", "french territory", "uk overseas territory"],
    useField: "country",
    defaultDisplayName: "Documentation not needed",
    formField: {
      name: "country",
      displayName: "Country",
      type: "AutocompleteField",
    },
    operation: "is",
  },
  requiresUKCNI: {
    evaluateField: "ukcni",
    evaluateValue: ["true"],
    useField: "country",
    defaultDisplayName: "Country requires a UK CNI",
    formField: {
      name: "country",
      displayName: "Country",
      type: "AutocompleteField",
    },
    operation: "is",
  },
  countryOffersAffirmation: {
    evaluateField: "type",
    evaluateValue: ["affirmation"],
    useField: "country",
    defaultDisplayName: "Country offers affirmation service",
    formField: {
      name: "country",
      displayName: "Country",
      type: "AutocompleteField",
    },
    operation: "is",
  },
  countryOffersCNI: {
    evaluateField: "type",
    evaluateValue: ["cni"],
    useField: "country",
    defaultDisplayName: "Country offers CNI service",
    formField: {
      name: "country",
      displayName: "Country",
      type: "AutocompleteField",
    },
    operation: "is",
  },
  countryNotPostal: {
    evaluateField: "postal",
    evaluateValue: ["false", "issuing"],
    useField: "country",
    defaultDisplayName: "Country only allows in-person CNI service",
    formField: {
      name: "country",
      displayName: "Country",
      type: "AutocompleteField",
    },
    operation: "is",
  },
  countryOnlyPostal: {
    evaluateField: "postal",
    evaluateValue: ["true"],
    useField: "country",
    defaultDisplayName: "Country only allows postal CNI service",
    formField: {
      name: "country",
      displayName: "Country",
      type: "AutocompleteField",
    },
    operation: "is",
  },
  showCelibacyText: {
    evaluateField: "type",
    evaluateValue: ["french territory"],
    useField: "country",
    defaultDisplayName: "Country is a French territory",
    formField: {
      name: "country",
      displayName: "Country",
      type: "AutocompleteField",
    },
    operation: "is",
  },
  showNoDocsCniText: {
    evaluateField: "type",
    evaluateValue: ["commonwealth", "uk overseas territory", "french territory"],
    useField: "country",
    defaultDisplayName: "Country only allows postal CNI service",
    formField: {
      name: "country",
      displayName: "Country",
      type: "AutocompleteField",
    },
    operation: "is",
  },
};

const AFFIRMATION_FORM = "../runner/src/server/forms-v3/affirmation.json";
const AFFIRMATION_CONDITIONS = {
  countryRequiresCertifiedPassport: {
    evaluateField: "certifiedPassport",
    evaluateValue: ["true"],
    useField: "country",
    defaultDisplayName: "Country requires passport to be certified",
    formField: {
      name: "country",
      displayName: "Country",
      type: "AutocompleteField",
    },
    operation: "is",
  },
};

const CNI_FORM = "../runner/src/server/forms-v3/cni.json";
const CNI_CONDITIONS = {
  countryRequiresCertifiedPassport: {
    evaluateField: "certifiedPassport",
    evaluateValue: ["true"],
    useField: "country",
    defaultDisplayName: "Country requires passport to be certified",
    formField: {
      name: "country",
      displayName: "Country",
      type: "AutocompleteField",
    },
    operation: "is",
  },
};

const CONTENT_FIELD_MAP = {
  country: "country",
  type: "type",
  "additional documentation": "additionalDocs",
  "postal application": "postal",
  "uk cni": "ukcni",
  "certified passport": "certifiedPassport",
  duration: "duration",
  "civil partnership": "civilPartnership",
  "other (localised content)": "otherInfo",
};
const CONTENT_RELEVANT_FIELDS = ["additionalDocs", "duration", "civilPartnership", "otherInfo"];
const BOOKING_LINKS_FIELD_MAP = {
  type: "type",
  country: "country",
  embassy: "post",
  "cabs link": "bookingLink",
};
const BOOKING_LINKS_RELEVANT_FIELDS = ["post", "bookingLink"];

const CONTENT_MAP: Record<string, FileConstants> = {
  content: {
    fieldMap: CONTENT_FIELD_MAP,
    relevant: CONTENT_RELEVANT_FIELDS,
  },
  "booking-links": {
    fieldMap: BOOKING_LINKS_FIELD_MAP,
    relevant: BOOKING_LINKS_RELEVANT_FIELDS,
  },
};

export {
  CONTENT_SOURCE,
  CONTENT_TARGET,
  CONTENT_MAP,
  BEFORE_YOU_START_FORM,
  BEFORE_YOU_START_CONDITIONS,
  AFFIRMATION_FORM,
  AFFIRMATION_CONDITIONS,
  CNI_FORM,
  CNI_CONDITIONS,
};
