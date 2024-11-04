import * as Services from "../middlewares/services";

declare global {
  namespace Express {
    interface Application {
      services: {
        marriageCaseService: Services.CaseService.MarriageCaseService;
        certifyCopyCaseService: Services.CaseService.CertifyCopyCaseService;
        requestDocumentCaseService: Services.CaseService.RequestDocumentCaseService;
        consularLetterCaseService: Services.CaseService.ConsularLetterCaseService;
        userService: Services.UserService;
        submitService: Services.SubmitService;
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
