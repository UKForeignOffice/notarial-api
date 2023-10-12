import rateLimit from "express-rate-limit";
import { Express, NextFunction, Request, Response } from "express";

export function rateLimitExceededErrorHandler(req: Request, _res: Response, next: NextFunction) {
  req.log.error("429 rate limit exceeded", { path: req.path });
  // const err = new ApplicationError("429", "429", "Rate limit exceeded");
  next(new Error("foo"));
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
