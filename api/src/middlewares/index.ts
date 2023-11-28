import { Application, json } from "express";
import pino from "pino-http";
import { FileService, NotifyService, SESService, SubmitService } from "./services";

export function initMiddleware(server: Application) {
  server.use(pino());
  server.use(json());
  const fileService = new FileService();
  const emailService = new SESService({ fileService });
  const notifyService = new NotifyService();
  const submitService = new SubmitService({
    fileService,
    emailService,
  });
  server.services = {
    fileService,
    emailService,
    notifyService,
    submitService,
  };
}
