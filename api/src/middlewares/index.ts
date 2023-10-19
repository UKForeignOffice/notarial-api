import { Application, json } from "express";
import pino from "pino-http";
import { FileService, SESService } from "./services";

export function initMiddleware(server: Application) {
  server.use(pino());
  server.use(json());
  server.locals.services = {
    fileService: new FileService(),
    sesService: new SESService(),
  };
}
