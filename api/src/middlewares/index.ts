import { Application, json } from "express";
import pino from "pino-http";
import { NotifyService, StaffService, SubmitService } from "./services";

export function initMiddleware(server: Application) {
  server.use(pino());
  server.use(json());
  const sesService = new StaffService();
  const notifyService = new NotifyService();
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
