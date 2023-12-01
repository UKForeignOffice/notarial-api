import { FileService, NotifyService, SESService, SubmitService } from "../middlewares/services";
import { CustomerEmailService } from "../middlewares/services/EmailService/CustomerEmailService";
import { StaffEmailService } from "../middlewares/services/EmailService/StaffEmailService";

declare global {
  namespace Express {
    interface Application {
      services: {
        fileService: FileService;
        customerEmailService: CustomerEmailService;
        staffEmailService: StaffEmailService;
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
