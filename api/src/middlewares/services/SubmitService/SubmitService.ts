import logger, { Logger } from "pino";
import { FormDataBody } from "../../../types";
import { answersHashMap, flattenQuestions } from "../helpers";
import { ApplicationError } from "../../../ApplicationError";
import { UserService } from "../UserService";
import { StaffService } from "../StaffService";
const { customAlphabet } = require("nanoid");

const nanoid = customAlphabet("1234567890ABCDEFGHIJKLMNPQRSTUVWXYZ-_", 10);
export class SubmitService {
  logger: Logger;
  userService: UserService;
  staffService: StaffService;

  constructor({ userService, staffService }) {
    this.logger = logger().child({ service: "Submit" });
    this.userService = userService;
    this.staffService = staffService;
  }
  generateId() {
    return nanoid();
  }

  /**
   * @throws ApplicationError
   */
  async submitForm(formData: FormDataBody) {
    const { questions = [], metadata } = formData;
    const formFields = flattenQuestions(questions);
    const answers = answersHashMap(formFields);
    const reference = metadata?.pay?.reference ?? this.generateId();
    const type = metadata?.type ?? "affirmation";

    const staffProcessJob = await this.staffService.sendToProcessQueue(formFields, "submission", {
      reference,
      payment: metadata.pay,
      type,
    });
    const userProcessJob = await this.userService.sendToProcessQueue(answers, { reference, payment: metadata.pay, type });

    this.logger.info({ reference, staffProcessJob, userProcessJob }, "submitted form data for processing");

    return {
      reference,
    };
  }
}
