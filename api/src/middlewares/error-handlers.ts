import { Express, NextFunction, Request, Response } from "express";

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
export function configureErrorHandlers(server: Express) {
  server.use((req: Request, res: Response) => {
    req.log.warn("404 Not found", { path: req.path });
    res.status(404).send({
      error: "The requested resource is unavailable",
    });
  });

  server.use(
    (err: HttpException, req: Request, res: Response, _next: NextFunction) => {
      req.log.error([err.code], err.message);
      res.status("status" in err ? err.status : 500);
      res.send(`This request could not be processed -- ${err.message}`);
    }
  );
}

export function rateLimitExceededErrorHandler(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  req.log.error("429 rate limit exceeded", { path: req.path });
  const err = new HttpException(429, "429", "Rate limit exceeded");
  next(err);
}
