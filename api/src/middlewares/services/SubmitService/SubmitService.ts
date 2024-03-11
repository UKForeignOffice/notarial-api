import logger, { Logger } from "pino";
import { FormDataBody } from "../../../types";
import { answersHashMap, flattenQuestions } from "../helpers";
import { NotifyService, SESService } from "../EmailService";
const { customAlphabet } = require("nanoid");

const nanoid = customAlphabet("1234567890ABCDEFGHIJKLMNPQRSTUVWXYZ-_", 10);
export class SubmitService {
  logger: Logger;
  notifyEmailService: NotifyService;
  staffEmailService: SESService;

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

    const postAlertOptions = this.notifyEmailService.getPostAlertOptions(answers, type, reference);
    const staffJobPromise = this.staffEmailService.send(formFields, "submission", { reference, payment: metadata.pay, type, postAlertOptions });
    const userNotifyJobPromise = this.notifyEmailService.sendEmailToUser(answers, { reference, payment: metadata.pay, type });

    await Promise.allSettled([staffJobPromise, userNotifyJobPromise]);
    return {
      reference,
    };
  }
}
