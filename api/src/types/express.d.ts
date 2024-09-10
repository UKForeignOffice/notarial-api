import { UserService, MarriageCaseService, SubmitService } from "../middlewares/services";

declare global {
  namespace Express {
    interface Application {
      services: {
        staffService: MarriageCaseService;
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
