export type ErrorTypes = "webhook" | "file" | "ses";
export const ERRORS: Record<ErrorTypes, Record<string, string>> = {
  webhook: {
    EMPTY_PAYLOAD: "Malformed form data: No questions property found",
    EMPTY_TEMPLATE_DATA: "No template data was returned",
  },
  file: {
    EMPTY_RES: "The file server did not return a response",
    API_ERROR: "There was an error returning this file",
    NOT_FOUND: "The requested file could not be found",
  },
  ses: {
    NO_TEMPLATE: "no template id was set for the specified form",
    TEMPLATE_NOT_FOUND: "no template with the specified id could be found",
    TEMPLATE_PART_MISSING: "the template subject line or body were missing",
    TEMPLATE_VAR_MISSING:
      "a required variable was missing from the template data",
    EMPTY_RES: "The email service did not return a response",
    BAD_REQUEST: "The email data being sent was malformed",
    API_ERROR: "The email service returned an error",
    UNKNOWN: "There was an unknown error sending the email",
  },
};

export type ErrorCode = keyof (typeof ERRORS)[ErrorTypes];
