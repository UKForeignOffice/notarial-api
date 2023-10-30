import { ErrorCode, ERRORS, ErrorTypes } from "./errors";

type ApplicationErrorOptions = {
  isOperational: boolean;
  exposeToClient: boolean;
};

const defaultOptions: ApplicationErrorOptions = {
  isOperational: true,
  exposeToClient: true,
};

export class ApplicationError extends Error {
  httpStatusCode: number;
  code: string;
  isOperational: boolean = true;
  exposeToClient: boolean = false;

  constructor(
    name: ErrorTypes,
    code: ErrorCode,
    httpStatusCode: number,
    message?: string,
    options?: Partial<ApplicationErrorOptions>
  ) {
    super(message);
    this.name = name;
    this.httpStatusCode = httpStatusCode;
    this.code = code;
    this.message = message ?? ERRORS[name][code];
    const { isOperational, exposeToClient } = { ...defaultOptions, ...options };
    this.isOperational = isOperational;
    this.exposeToClient = exposeToClient;
  }
}
