import { FileConstants } from "./types";

const CONTENT_SOURCE = "./tsv";
const CONTENT_TARGET = "../api/src/middlewares/services/utils/additionalContexts.json";

const CONTENT_FIELD_MAP = {
  country: "country",
  type: "type",
  "additional documentation": "additionalDocs",
  "postal application": "postal",
  "uk cni": "ukcni",
  "certified passport": "certifiedPassport",
  duration: "duration",
  "civil partnership": "civilPartnership",
  "localised content - start pages": "localRequirements",
};
const CONTENT_RELEVANT_FIELDS = ["additionalDocs", "duration", "localRequirements", "civilPartnership"];
const BOOKING_LINKS_FIELD_MAP = {
  country: "country",
  embassy: "post",
  "cabs link": "bookingLink",
  "post address": "postAddress",
};
const BOOKING_LINKS_RELEVANT_FIELDS = ["post", "bookingLink", "postAddress"];

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

export { CONTENT_SOURCE, CONTENT_TARGET, CONTENT_MAP };
