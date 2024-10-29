import { Application, json } from "express";
import pino from "pino-http";
import { QueueService, MarriageCaseService, SubmitService, UserService } from "./services";
import { CertifyCopyCaseService } from "./services";
import { RequestDocumentCaseService } from "./services";
import { ConsularLetterCaseService } from "./services/CaseService/consularLetter/ConsularLetterCaseService";

export function initMiddleware(server: Application) {
  server.use(pino());
  server.use(json());
  const queueService = new QueueService();
  const marriageCaseService = new MarriageCaseService({ queueService });
  const certifyCopyCaseService = new CertifyCopyCaseService({ queueService });
  const requestDocumentCaseService = new RequestDocumentCaseService({ queueService });
  const consularLetterCaseService = new ConsularLetterCaseService({ queueService });
  const userService = new UserService({ queueService });

  const submitService = new SubmitService({
    userService,
    marriageCaseService,
    certifyCopyCaseService,
    requestDocumentCaseService,
    consularLetterCaseService,
  });

  server.services = {
    userService,
    marriageCaseService,
    certifyCopyCaseService,
    requestDocumentCaseService,
    consularLetterCaseService,
    submitService,
  };
}
