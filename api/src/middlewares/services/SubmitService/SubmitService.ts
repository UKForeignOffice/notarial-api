import logger, { Logger } from "pino";
import { FormDataBody } from "../../../types";
import { answersHashMap, flattenQuestions } from "../helpers";
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

  async submitForm(formData: FormDataBody) {
    const { questions = [], metadata } = formData;
    const formFields = flattenQuestions(questions);
    const answers = answersHashMap(formFields);
    const reference = metadata?.pay?.reference ?? this.generateId();
    const type = metadata?.type ?? "affirmation";

    try {
      const shouldSkipStaffEmail = metadata.SKIP_QUEUEING_STAFF_EMAIL ?? false;
      if (!shouldSkipStaffEmail) {
        const staffProcessJob = await this.staffService.sendToProcessQueue(formFields, "submission", {
          reference,
          payment: metadata.pay,
          type,
        });
        this.logger.info({ reference, staffProcessJob }, `SES_PROCESS job queued successfully for ${reference}`);
      } else {
        this.logger.info({ reference }, `Skipping queueing staff email for ${reference}`);
      }

      const shouldSkipUserEmail = metadata.SKIP_QUEUEING_USER_EMAIL ?? false;
      if (!shouldSkipUserEmail) {
        const userProcessJob = await this.userService.sendToProcessQueue(answers, { reference, payment: metadata.pay, type });
        this.logger.info({ reference, userProcessJob }, `NOTIFY_PROCESS job queued successfully for ${reference}`);
      } else {
        this.logger.info({ reference }, `Skipping queueing user email for ${reference}`);
      }
    } catch (e) {
      /**
       * Even though the data did not queue correctly, the user's data is safe in the /queue database, so we can respond with the reference number.
       * The reference number is returned so that the user can get support / get refunds etc. The user's submission should be retried.
       */
      this.logger.error(
        { reference, err: e, errorCode: "SUBMIT_FORM_ERROR" },
        "NOTARIAL_API_ERROR User's data did not queue correctly. Responding with reference number since their data is safe."
      );
    }

    return {
      reference,
    };
  }
}
