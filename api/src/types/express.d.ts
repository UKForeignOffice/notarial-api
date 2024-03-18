import { UserService, StaffService, SubmitService } from "../middlewares/services";

declare global {
  namespace Express {
    interface Application {
      services: {
        staffService: StaffService;
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
