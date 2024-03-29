import express, { Express } from "express";
import { initRoutes } from "./routes/initRoutes";
import { configureRateLimit } from "./middlewares/rate-limit";
import { configureErrorHandlers } from "./middlewares/error-handlers";
import { initMiddleware } from "./middlewares";

const server = express();
export function createServer(): Express {
  initMiddleware(server);
  configureRateLimit(server);
  initRoutes(server);
  configureErrorHandlers(server);

  return server;
}
