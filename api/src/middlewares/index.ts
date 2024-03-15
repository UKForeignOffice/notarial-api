import { Application, json } from "express";
import pino from "pino-http";
import { NotifyService, StaffService, SubmitService, QueueService } from "./services";

export function initMiddleware(server: Application) {
  server.use(pino());
  server.use(json());
  const queueService = new QueueService();
  const sesService = new StaffService({ queueService });
  const notifyService = new NotifyService({ queueService });
  const submitService = new SubmitService({
    notifyService,
    sesService,
  });
  server.services = {
    notifyService,
    sesService,
    submitService,
  };
}
