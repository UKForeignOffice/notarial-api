import { Application, json } from "express";
import pino from "pino-http";
import { FileService, SESService, SubmitService } from "./services";

export function initMiddleware(server: Application) {
  server.use(pino());
  server.use(json());
  const fileService = new FileService();
  const sesService = new SESService({ fileService });
  const submitService = new SubmitService({
    fileService,
    emailService: sesService,
  });
  server.locals.services = {
    fileService,
    sesService,
    submitService,
  };
}
