import { Application, json } from "express";
import pino from "pino-http";
import { QueueService, CaseService, SubmitService, UserService } from "./services";

export function initMiddleware(server: Application) {
  server.use(pino());
  server.use(json());
  const queueService = new QueueService();
  const marriageCaseService = new CaseService.MarriageCaseService({ queueService });
  const certifyCopyCaseService = new CaseService.CertifyCopyCaseService({ queueService });
  const requestDocumentCaseService = new CaseService.RequestDocumentCaseService({ queueService });
  const consularLetterCaseService = new CaseService.ConsularLetterCaseService({ queueService });
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
