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
  notifyEmailService: UserService;
  staffEmailService: StaffService;

  constructor({ notifyService, sesService }) {
    this.logger = logger().child({ service: "Submit" });
    this.notifyEmailService = notifyService;
    this.staffEmailService = sesService;
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

    try {
      const staffProcessJob = await this.staffEmailService.sendToProcessQueue(formFields, "submission", {
        reference,
        payment: metadata.pay,
        type,
      });
      const userProcessJob = await this.notifyEmailService.sendToProcessQueue(answers, { reference, payment: metadata.pay, type });
      this.logger.info({ reference, staffProcessJob, userProcessJob }, "submitted form data for processing");
    } catch (e) {
      throw new ApplicationError("WEBHOOK", "QUEUE_ERROR", 500, ``);
    }
    return {
      reference,
    };
  }
}
