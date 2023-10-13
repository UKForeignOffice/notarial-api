import { S3Service, EncryptionService } from "../middlewares/services";

declare global {
  namespace Express {
    interface Locals {
      services: {
        s3Service: S3Service;
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
