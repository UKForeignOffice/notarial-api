import { Application, json } from "express";
import pino from "pino-http";
import { EncryptionService, FileService } from "./services";

export function initMiddleware(server: Application) {
  server.use(pino());
  server.use(json());
  server.locals.services = {
    fileService: new FileService(),
    encryptionService: new EncryptionService(),
  };
}
