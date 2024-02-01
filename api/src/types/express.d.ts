import { SubmitService } from "../middlewares/services";

declare global {
  namespace Express {
    interface Application {
      services: {
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
