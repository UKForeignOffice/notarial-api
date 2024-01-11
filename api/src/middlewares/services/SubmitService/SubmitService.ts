import logger, { Logger } from "pino";
import { FileService } from "../FileService";
import { FormDataBody } from "../../../types";
import { flattenQuestions } from "../helpers";
import { EmailServiceProvider } from "../EmailService/types";
const { customAlphabet } = require("nanoid");

const nanoid = customAlphabet("1234567890ABCDEFGHIJKLMNPQRSTUVWXYZ-_", 10);
export class SubmitService {
  logger: Logger;
  fileService: FileService;
  customerEmailService: EmailServiceProvider;
  staffEmailService: EmailServiceProvider;

  constructor({ fileService, notifyService, sesService }) {
    this.logger = logger().child({ service: "Submit" });
    this.fileService = fileService;
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
    const { questions = [] } = formData;
    const formFields = flattenQuestions(questions);

    formFields.push({
      key: "paid",
      title: "paid",
      type: "metadata",
      answer: !!formData.fees?.paymentReference,
    });

    const reference = this.generateId();

    const staffPromise = this.staffEmailService.send(formFields, "affirmation", reference);

    const customerPromise = this.customerEmailService.send(formFields, "standard", reference);

    const [staffRes, customerRes] = await Promise.all([staffPromise, customerPromise]);

    return {
      response: {
        staff: staffRes,
        customer: customerRes,
      },
      reference,
    };
  }
}
