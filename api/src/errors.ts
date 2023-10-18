export const ERRORS = {
  webhook: {
    EMPTY_PAYLOAD: "W001 - Malformed form data: No questions property found",
    EMPTY_TEMPLATE_DATA: "W002 - No template data was returned",
  },
  file: {
    EMPTY_RES: "F001 - The file server did not return a response",
    API_ERROR: "F002 - There was an error returning this file",
    NOT_FOUND: "F003 - The requested file could not be found",
    UNKNOWN: "F999 - There was an unknown error with the File service",
  },
  ses: {
    EMPTY_RES: "E001 - The email service did not return a response",
    BAD_REQUEST: "E002 - The email data being sent was malformed",
    API_ERROR: "E003 - The email service returned an error",
    UNKNOWN: "E999 - There was an unknown error sending the email",
  },
};
