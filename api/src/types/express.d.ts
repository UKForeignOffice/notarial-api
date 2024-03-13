import { NotifyService, SESService, SubmitService } from "../middlewares/services";

declare global {
  namespace Express {
    interface Application {
      services: {
        sesService: SESService;
        notifyService: NotifyService;
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
