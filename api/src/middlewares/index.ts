import { Application, json } from "express";
import pino from "pino-http";
import { QueueService, MarriageCaseService, SubmitService, UserService } from "./services";

export function initMiddleware(server: Application) {
  server.use(pino());
  server.use(json());
  const queueService = new QueueService();
  const marriageCaseService = new MarriageCaseService({ queueService });
  const userService = new UserService({ queueService });
  const submitService = new SubmitService({
    userService,
    marriageCaseService,
  });
  server.services = {
    userService,
    marriageCaseService,
    submitService,
  };
}
