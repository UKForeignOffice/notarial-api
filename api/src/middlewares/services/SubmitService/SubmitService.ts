import logger, { Logger } from "pino";
import { FileService } from "../FileService";
import { FormDataBody } from "../../../types";
import { flattenQuestions } from "../helpers/flattenQuestions";
import { isFieldType } from "../../../utils";
import { isNotFieldType } from "../../../utils";
import { CustomerEmailService } from "../EmailService/CustomerEmailService";
import { StaffEmailService } from "../EmailService/StaffEmailService";
import { FormField } from "../../../types/FormField";
const { customAlphabet } = require("nanoid");

const nanoid = customAlphabet("1234567890ABCDEFGHIJKLMNPQRSTUVWXYZ-_", 10);
export class SubmitService {
  logger: Logger;
  fileService: FileService;
  customerEmailService: CustomerEmailService;
  staffEmailService: StaffEmailService;

  constructor({ fileService, customerEmailService, staffEmailService }) {
    this.logger = logger().child({ service: "Submit" });
    this.fileService = fileService;
    this.customerEmailService = customerEmailService;
    this.staffEmailService = staffEmailService;
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

    const reference = this.generateId();

    const staffRes = await this.buildAndSendStaffEmail(allOtherFields, fileFields, reference);

    this.logger.info(`Reference ${reference} staff email sent successfully with SES message id: ${staffRes.MessageId}`);

    const customerRes = await this.buildAndSendCustomerEmail(allOtherFields, reference, !!formData.fees?.paymentReference);

    this.logger.info(`Reference ${reference} user email sent successfully with Notify id: ${customerRes?.id}`);

    const response = {
      staffRes,
      customerRes,
    };
    return { response, reference };
  }

  async buildAndSendStaffEmail(formData: FormField[], fileFields: FormField[], reference: string) {
    const emailBody = await this.staffEmailService.buildEmail(formData, "oath", fileFields, reference);
    return await this.staffEmailService.sendEmail(emailBody);
  }

  async buildAndSendCustomerEmail(formData: FormField[], reference: string, paid: boolean) {
    const emailBody = this.customerEmailService.buildEmail(formData, reference, paid);
    return await this.customerEmailService.sendEmail(emailBody);
  }
}
