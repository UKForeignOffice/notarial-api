import logger, { Logger } from "pino";
import config from "config";
import { AffirmationTemplate } from "../../types/AffirmationTemplate";
import { CNITemplate } from "../../types/CNITemplate";
import { MailAttachments } from "../../types/MailAttachments";

export class SESService {
  affirmationTemplate: string;
  cniTemplate: string;
  logger: Logger;

  constructor() {
    this.affirmationTemplate = config.get("affirmationTemplate");
    this.cniTemplate = config.get("cniTemplate");
    this.logger = logger().child({ service: "SES" });
  }

  buildAndSendEmail(
    template: AffirmationTemplate | CNITemplate,
    attachments: MailAttachments
  ) {}
}
