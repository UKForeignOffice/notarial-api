import { Application, json } from "express";
import pino from "pino-http";
import { NotifyService, SESService, SubmitService } from "./services";

export function initMiddleware(server: Application) {
  server.use(pino());
  server.use(json());
  const sesService = new SESService();
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
