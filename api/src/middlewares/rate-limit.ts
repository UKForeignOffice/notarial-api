import rateLimit from "express-rate-limit";
import { Express, NextFunction, Request, Response } from "express";
import { HttpException } from "./error-handlers";

export function rateLimitExceededErrorHandler(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  req.log.error("429 rate limit exceeded", { path: req.path });
  const err = new HttpException(429, "429", "Rate limit exceeded");
  next(err);
}

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 120,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler: rateLimitExceededErrorHandler,
});

export function configureRateLimit(server: Express) {
  server.use(limiter);
}
