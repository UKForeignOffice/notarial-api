import { UserService, MarriageCaseService, CertifyCopyCaseService, RequestDocumentCaseService, SubmitService } from "../middlewares/services";

declare global {
  namespace Express {
    interface Application {
      services: {
        marriageCaseService: MarriageCaseService;
        certifyCopyCaseService: CertifyCopyCaseService;
        requestDocumentCaseService: RequestDocumentCaseService;
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
