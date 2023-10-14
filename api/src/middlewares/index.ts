import { Application, json } from "express";
import pino from "pino-http";
import { EncryptionService, UploadService } from "./services";

export function initMiddleware(server: Application) {
  server.use(pino());
  server.use(json());
  server.locals.services = {
    uploadService: new UploadService(),
    encryptionService: new EncryptionService(),
  };
}
