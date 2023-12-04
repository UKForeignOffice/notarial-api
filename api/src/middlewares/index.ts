import { Application, json } from "express";
import pino from "pino-http";
import { FileService, NotifyService, SESService, SubmitService } from "./services";
import { CustomerEmailService } from "./services/EmailService/CustomerEmailService";
import { StaffEmailService } from "./services/EmailService/StaffEmailService";

export function initMiddleware(server: Application) {
  server.use(pino());
  server.use(json());
  const fileService = new FileService();
  const sesService = new SESService();
  const notifyService = new NotifyService();
  const customerEmailService = new CustomerEmailService({ notifyService });
  const staffEmailService = new StaffEmailService({ sesService, fileService });
  const submitService = new SubmitService({
    fileService,
    customerEmailService,
    staffEmailService,
  });
  server.services = {
    fileService,
    customerEmailService,
    staffEmailService,
    submitService,
  };
}
