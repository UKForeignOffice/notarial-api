import { S3Service } from "../middlewares/services";

declare global {
  namespace Express {
    interface Locals {
      services: {
        s3Service: S3Service;
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
