import { FileService, SESService, SubmitService } from "../middlewares/services";

declare global {
  namespace Express {
    interface Application {
      services: {
        fileService: FileService;
        emailService: SESService;
        submitService: SubmitService;
      };
    }

    interface Locals {
      Response: {
        app: {
          locals: Locals;
        };
        locals: Locals;
      };
    }
  }
}
