import { FileService, SESService, SubmitService } from "../middlewares/services";

declare global {
  namespace Express {
    interface Locals {
      services: {
        fileService: FileService;
        sesService: SESService;
        submitService: SubmitService;
      };
      Response: {
        app: {
          locals: Locals;
        };
        locals: Locals;
      };
    }
  }
}
