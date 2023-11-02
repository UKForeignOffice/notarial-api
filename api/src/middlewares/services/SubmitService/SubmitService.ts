import logger, { Logger } from "pino";
import { FileService } from "../FileService";
import { SESService } from "../EmailService";
import { FormDataBody } from "../../../types";
import { flattenQuestions } from "../../../handlers/forms/helpers/flattenQuestions";
import { isFieldType } from "../../../utils";
import { isNotFieldType } from "../../../utils";
const { customAlphabet } = require("nanoid");

const nanoid = customAlphabet("1234567890ABCDEFGHIJKLMNPQRSTUVWXYZ-_", 10);
export class SubmitService {
  logger: Logger;
  fileService: FileService;
  emailService: SESService;

  constructor({ fileService, emailService }) {
    this.logger = logger().child({ service: "Submit" });
    this.fileService = fileService;
    this.emailService = emailService;
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

    const fileFields = formFields.filter(isFieldType("file"));
    const allOtherFields = formFields.filter(isNotFieldType("file"));
    const emailBody = this.emailService.buildOathEmailBody(allOtherFields);
    const reference = this.generateId();
    const submission = await this.emailService.buildEmailWithAttachments({
      subject: `Oath - ${reference}`,
      body: emailBody,
      attachments: fileFields,
    });

    const response = await this.emailService.sendEmail(submission);
    this.logger.info(`Reference ${reference} sent successfully with SES message id: ${response.MessageId}`);
    return { response, reference };
  }
}
