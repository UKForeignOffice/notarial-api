import logger, { Logger } from "pino";
import config from "config";
import { MailAttachments } from "../../types/MailAttachments";
import { TemplateData } from "../../handlers/helpers/getTemplateDataFromInputs";
import { GetTemplateCommand, SESClient } from "@aws-sdk/client-ses";
import { ERRORS } from "../../errors";

export class SESService {
  templates: {
    cni?: string;
    affirmation?: string;
  } = {};
  logger: Logger;
  ses: SESClient;

  constructor() {
    this.templates.affirmation = config.get("affirmationTemplate");
    this.templates.cni = config.get("cniTemplate");
    this.logger = logger().child({ service: "SES" });
    this.ses = new SESClient();
  }

  async getTemplate(type: "cni" | "affirmation") {
    if (!this.templates[type]) {
      this.logger.error(ERRORS.ses.NO_TEMPLATE);
      return;
    }
    const { Template } = await this.ses.send(
      new GetTemplateCommand({
        TemplateName: this.templates[type],
      })
    );

    if (!Template) {
      this.logger.error(ERRORS.ses.TEMPLATE_NOT_FOUND);
      return;
    }
    return Template;
  }

  buildAndSendEmail(
    template: TemplateData,
    attachments: MailAttachments,
    type: "cni" | "affirmation"
  ) {}
}
