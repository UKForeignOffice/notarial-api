import { Application, json } from "express";
import pino from "pino-http";
import { UserService, StaffService, SubmitService, QueueService } from "./services";

export function initMiddleware(server: Application) {
  server.use(pino());
  server.use(json());
  const queueService = new QueueService();
  const sesService = new StaffService({ queueService });
  const userService = new UserService({ queueService });
  const submitService = new SubmitService({
    userService,
    sesService,
  });
  server.services = {
    userService,
    sesService,
    submitService,
  };
}
