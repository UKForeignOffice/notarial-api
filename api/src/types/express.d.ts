import {
  EncryptionService,
  FileService,
  SESService,
} from "../middlewares/services";

declare global {
  namespace Express {
    interface Locals {
      services: {
        fileService: FileService;
        encryptionService: EncryptionService;
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
