import { EncryptionService, FileService } from "../middlewares/services";

declare global {
  namespace Express {
    interface Locals {
      services: {
        fileService: FileService;
        encryptionService: EncryptionService;
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
