import { UserService, MarriageCaseService, SubmitService } from "../middlewares/services";
import { CertifyCopyCaseService } from "../middlewares/services/CaseService/certifyCopy/CertifyCopyCaseService";

declare global {
  namespace Express {
    interface Application {
      services: {
        marriageCaseService: MarriageCaseService;
        certifyCopyCaseService: CertifyCopyCaseService;
        userService: UserService;
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
