import { Application, json } from "express";
import pino from "pino-http";
import { QueueService, StaffService, SubmitService, UserService } from "./services";

export function initMiddleware(server: Application) {
  server.use(pino());
  server.use(json());
  const queueService = new QueueService();
  const staffService = new StaffService({ queueService });
  const userService = new UserService({ queueService });
  const submitService = new SubmitService({
    userService,
    staffService,
  });
  server.services = {
    userService,
    staffService,
    submitService,
  };
}
