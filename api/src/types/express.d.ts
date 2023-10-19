import { FileService, SESService } from "../middlewares/services";

declare global {
  namespace Express {
    interface Locals {
      services: {
        fileService: FileService;
        sesService: SESService;
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
