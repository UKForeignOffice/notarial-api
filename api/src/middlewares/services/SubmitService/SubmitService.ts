import logger, { Logger } from "pino";
import { FileService } from "../file";
import { SESService } from "../EmailService/SESService";
import { FormDataBody } from "../../../types";
import { flattenQuestions } from "../../../handlers/forms/helpers/flattenQuestions";
import { isFieldType } from "../../../utils/isFieldType";
import { isNotFieldType } from "../../../utils/isNotFieldType";

export class SubmitService {
  logger: Logger;
  fileService: FileService;
  emailService: SESService;

  constructor({ fileService, emailService }) {
    this.logger = logger().child({ service: "Submit" });
    this.fileService = fileService;
    this.emailService = emailService;
  }

  async submitForm(formData: FormDataBody) {
    const { questions = [] } = formData;
    const formFields = flattenQuestions(questions);

    const fileFields = formFields.filter(isFieldType("file"));
    const allOtherFields = formFields.filter(isNotFieldType("file"));
    const emailBody = this.emailService.buildOathEmailBody(allOtherFields);
    const submission = await this.emailService.buildEmailWithAttachments({
      subject: "Oath",
      body: emailBody,
      attachments: fileFields,
    });

    await this.emailService.sendEmail(submission);
  }
}
