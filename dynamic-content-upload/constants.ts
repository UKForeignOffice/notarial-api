import { FileConstants } from "./types";

const CONTENT_SOURCE = "./csv";
const CONTENT_TARGET = "../runner/src/server/templates/additionalContexts.json";
const AFFIRMATION_FORM = "../runner/src/server/forms-v3/affirmation.json";
// const CNI_FORM = "../runner/src/server/forms-v3/cni.json";

const AFFIRMATION_CONDITIONS = {
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
    section: "beforeYouStart",
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
    section: "beforeYouStart",
    operation: "is",
  },
  affirmationNotNeeded: {
    evaluateField: "type",
    evaluateValue: ["commonwealth", "none"],
    useField: "country",
    defaultDisplayName: "Country does not require affirmation or CNI",
    formField: {
      name: "country",
      displayName: "Country",
      type: "AutocompleteField",
    },
    section: "beforeYouStart",
    operation: "is",
  },
};

// const CNI_CONDITIONS = {
//     countryOffersAffirmation: {
//         evaluateField: "type",
//         evaluateValue: ["affirmation"],
//         useField: "country",
//         defaultDisplayName: "Country offers affirmation service",
//         formField: {
//             name: "country",
//             displayName: "Country",
//             type: "AutocompleteField"
//         },
//         section: "beforeYouStart",
//         operation: "is"
//     },
//     countryOffersCNI: {
//         evaluateField: "type",
//         evaluateValue: ["cni"],
//         useField: "country",
//         defaultDisplayName: "Country offers CNI service",
//         formField: {
//             name: "country",
//             displayName: "Country",
//             type: "AutocompleteField"
//         },
//         section: "beforeYouStart",
//         operation: "is"
//     },
//     affirmationNotNeeded: {
//         evaluateField: "type",
//         evaluateValue: ["commonwealth", "none"],
//         useField: "country",
//         defaultDisplayName: "Country does not require affirmation or CNI",
//         formField: {
//             name: "country",
//             displayName: "Country",
//             type: "AutocompleteField"
//         },
//         section: "beforeYouStart",
//         operation: "is"
//     }
// }
const CONTENT_FIELD_MAP = {
  country: "country",
  type: "type",
  "additional documentation": "additionalDocs",
  duration: "duration",
  "other (local idiosyncrasies)": "otherInfo",
};
const CONTENT_RELEVANT_FIELDS = ["additionalDocs", "duration", "otherInfo"];
const BOOKING_LINKS_FIELD_MAP = {
  type: "type",
  country: "country",
  embassy: "post",
  "giving notice": "noticeLink",
  "exchanging cni": "exchangeLink",
};
const BOOKING_LINKS_RELEVANT_FIELDS = ["post", "noticeLink", "exchangeLink"];

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
  AFFIRMATION_FORM,
  CONTENT_MAP,
  AFFIRMATION_CONDITIONS,
};
