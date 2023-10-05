import rateLimit from "express-rate-limit";
import { Express } from "express";
import { rateLimitExceededErrorHandler } from "./error-handlers";

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
