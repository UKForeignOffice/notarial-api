import { Application, json } from "express";
import pino from "pino-http";
import { EncryptionService, S3Service } from "./services";

export function initMiddleware(server: Application) {
  server.use(pino());
  server.use(json());
  server.locals.services = {
    s3Service: new S3Service(),
    encryptionService: new EncryptionService(),
  };
}
