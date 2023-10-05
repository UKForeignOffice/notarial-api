import { Express, NextFunction, Request, Response } from "express";
import { logger } from "../services";

export class HttpException extends Error {
  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "HttpException";
    this.status = status;
    this.code = code;
    this.message = message;
  }

  status: number;
  code?: string;
}
export const configureErrorHandlers = (server: Express) => {
  server.use((req: Request, res: Response) => {
    logger.warn("404 Not found", { path: req.path });
    res.status(404).send({
      error: "The requested resource is unavailable",
    });
  });

  server.use(
    (err: HttpException, _req: Request, res: Response, _next: NextFunction) => {
      logger.error([`${err.status} Error`], err.message);
      res.status("status" in err ? err.status : 500);
      res.send(getErrorMessage(err.message));
    }
  );
};

function getErrorMessage(message: string) {
  let baseError = "This request could not be processed";
  return `${baseError} - ${message ?? baseError}`;
}

export function rateLimitExceededErrorHandler(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  logger.error("429 rate limit exceeded", { path: req.path });
  const err = new HttpException(429, "429", "Rate limit exceeded");
  next(err);
}
