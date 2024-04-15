/**
 * These errors are for use in {@link ApplicationError}.
 * {@link ERRORS} can be imported and used anywhere.
 */

/**
 * To add a new category of error (new {@link ErrorTypes})
 * 1. Add a type to {@link ErrorTypes}
 * 2. Create a new type, named <YourNewType>ErrorCode
 * 3. Add error codes as a union, in snake case and capitalised, e.g. "SOME_ERROR_CODE"
 * 4. Add <YourNewType>ErrorCode to the {@link ErrorCodes union}
 * 5. Create a new const, named <YOUR_NEW_TYPE>, with the type {@link ErrorRecord}, e.g. `ErrorRecord<YourNewTypeErrorCode>`
 * 6. Add a new property and value to `ErrorRecords`, the key will be the ErrorType, and the value will be the const created in (5)
 * 7. Do the same for the const {@link ERRORS}
 */

/**
 * Category of the error - this is likely to match the service it came from
 */
export type ErrorTypes = "WEBHOOK" | "SES" | "NOTIFY" | "QUEUE" | "GENERIC";

/**
 * Error code for the matching ErrorType.
 */
type WebhookErrorCode = "VALIDATION";
type SESErrorCode = "MISSING_ANSWER" | "PROCESS_VALIDATION" | "UNKNOWN";
type NotifyErrorCode = "PROCESS_VALIDATION" | "UNKNOWN";
type QueueErrorCode = "SES_SEND_ERROR" | "SES_PROCESS_ERROR" | "NOTIFY_SEND_ERROR" | "NOTIFY_PROCESS_ERROR";

type GenericErrorCode = "UNKNOWN" | "RATE_LIMIT_EXCEEDED";

/**
 * Union of all the different ErrorCode.
 */
export type ErrorCode = WebhookErrorCode | SESErrorCode | NotifyErrorCode | QueueErrorCode | GenericErrorCode;

/**
 * {@ErrorRecord} uses `Record`, which means every key passed into the generic, must be implemented
 * for example, if there is a new ErrorCode for WebhookErrorCode, then the const WEBHOOK needs to implement
 * the new error code as a property.
 */
type ErrorRecord<T extends ErrorCode> = Record<T, string>;

const WEBHOOK: ErrorRecord<WebhookErrorCode> = {
  VALIDATION: "Malformed form data: The supplied form data is invalid",
};

const SES: ErrorRecord<SESErrorCode> = {
  MISSING_ANSWER: "The payload is missing an answer",
  PROCESS_VALIDATION: "Malformed POST data: The supplied form data is invalid",
  UNKNOWN: "There was an unknown error sending the email",
};

const NOTIFY: ErrorRecord<NotifyErrorCode> = {
  UNKNOWN: "There was an unknown error sending the email",
  PROCESS_VALIDATION: "Malformed POST data: The supplied form data is invalid",
};

const GENERIC: ErrorRecord<GenericErrorCode> = {
  UNKNOWN: "Unknown error",
  RATE_LIMIT_EXCEEDED: "Rate limit exceeded",
};

const QUEUE: ErrorRecord<QueueErrorCode> = {
  NOTIFY_PROCESS_ERROR: "unable to queue NOTIFY_PROCESS_ERROR",
  NOTIFY_SEND_ERROR: "unable to queue NOTIFY_SEND_ERROR",
  SES_PROCESS_ERROR: "unable to queue SES_PROCESS_ERROR",
  SES_SEND_ERROR: "unable to queue SES_SEND_ERROR",
};

type ErrorRecords = {
  WEBHOOK: typeof WEBHOOK;
  SES: typeof SES;
  NOTIFY: typeof NOTIFY;
  QUEUE: typeof QUEUE;
  GENERIC: typeof GENERIC;
};
export const ERRORS: ErrorRecords = {
  WEBHOOK,
  SES,
  NOTIFY,
  QUEUE,
  GENERIC,
};
