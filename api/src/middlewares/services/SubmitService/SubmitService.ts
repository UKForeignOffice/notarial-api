import logger, { Logger } from "pino";
import { FormDataBody } from "../../../types";
import { answersHashMap, flattenQuestions } from "../helpers";
import { UserService } from "../UserService";
import { MarriageCaseService, RequestDocumentCaseService, CertifyCopyCaseService, ConsularLetterCaseService } from "../CaseService";
import { getCaseServiceName } from "../utils/getCaseServiceName";
import { CaseService } from "../CaseService/types";
const { customAlphabet } = require("nanoid");

const nanoid = customAlphabet("1234567890ABCDEFGHIJKLMNPQRSTUVWXYZ-_", 10);

type InjectedServices = {
  userService: UserService;
  marriageCaseService: MarriageCaseService;
  certifyCopyCaseService: CertifyCopyCaseService;
  requestDocumentCaseService: RequestDocumentCaseService;
  consularLetterCaseService: ConsularLetterCaseService;
};
type SubmitServiceOptions = InjectedServices & {
  /**
   * Add any other constructor options here
   */
};

export class SubmitService {
  logger: Logger;
  userService: UserService;
  marriageCaseService: MarriageCaseService;
  certifyCopyCaseService: CertifyCopyCaseService;
  requestDocumentCaseService: RequestDocumentCaseService;
  consularLetterCaseService: ConsularLetterCaseService;

  constructor(options: SubmitServiceOptions) {
    this.logger = logger().child({ service: "Submit" });
    this.userService = options.userService;
    this.marriageCaseService = options.marriageCaseService;
    this.certifyCopyCaseService = options.certifyCopyCaseService;
    this.requestDocumentCaseService = options.requestDocumentCaseService;
    this.consularLetterCaseService = options.consularLetterCaseService;
  }
  generateId() {
    return nanoid();
  }

  async submitForm(formData: FormDataBody) {
    const { questions = [], metadata, fees } = formData;
    const formFields = flattenQuestions(questions);
    const answers = answersHashMap(formFields);
    const { pay, type } = metadata;
    const reference = metadata?.pay?.reference ?? this.generateId();
    const caseServiceName = getCaseServiceName(type);
    if (pay) {
      pay.total = fees?.total;
    }

    try {
      const caseService: CaseService = this[caseServiceName];
      const processQueueData = caseService.buildProcessQueueData({
        fields: formFields,
        reference,
        type,
        metadata,
      });
      const caseProcessJob = await caseService.sendToProcessQueue(processQueueData);
      this.logger.info({ reference, caseProcessJob }, `SES_PROCESS job queued successfully for ${reference}`);

      const userProcessJob = await this.userService.sendToProcessQueue(answers, { reference, payment: metadata.pay, type, postal: metadata.postal });

      this.logger.info({ reference, userProcessJob }, `NOTIFY_PROCESS job queued successfully for ${reference}`);
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
