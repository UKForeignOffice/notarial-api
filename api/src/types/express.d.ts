import { UserService, MarriageCaseService, CertifyCopyCaseService, RequestDocumentCaseService, SubmitService } from "../middlewares/services";
import { ConsularLetterCaseService } from "../middlewares/services/CaseService/consularLetter/ConsularLetterCaseService";

declare global {
  namespace Express {
    interface Application {
      services: {
        marriageCaseService: MarriageCaseService;
        certifyCopyCaseService: CertifyCopyCaseService;
        requestDocumentCaseService: RequestDocumentCaseService;
        consularLetterCaseService: ConsularLetterCaseService;
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
