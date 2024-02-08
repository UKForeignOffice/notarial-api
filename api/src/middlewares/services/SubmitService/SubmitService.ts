import logger, { Logger } from "pino";
import { FormDataBody } from "../../../types";
import { flattenQuestions } from "../helpers";
import { NotifyService, SESService } from "../EmailService";
const { customAlphabet } = require("nanoid");

const nanoid = customAlphabet("1234567890ABCDEFGHIJKLMNPQRSTUVWXYZ-_", 10);
export class SubmitService {
  logger: Logger;
  customerEmailService: NotifyService;
  staffEmailService: SESService;

  constructor({ notifyService, sesService }) {
    this.logger = logger().child({ service: "Submit" });
    this.customerEmailService = notifyService;
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
    const reference = metadata.pay?.reference ?? this.generateId();

    formFields.push({
      key: "paid",
      title: "paid",
      type: "metadata",
      answer: !!formData.fees?.paymentReference,
    });

    const staffJobId = await this.staffEmailService.send(formFields, "affirmation", { reference, payment: metadata.pay });
    const userNotifyJobId = await this.customerEmailService.send(formFields, "userConfirmation", reference);

    return {
      response: {
        staff: staffJobId,
        customer: userNotifyJobId,
      },
      reference,
    };
  }
}
