import logger, { Logger } from "pino";
import { SendRawEmailCommand, SESClient, SESServiceException } from "@aws-sdk/client-ses";
import { ses } from "../../../SESClient";
import { FileService } from "../FileService";
import * as handlebars from "handlebars";
import { ApplicationError } from "../../../ApplicationError";

export class SESService {
  logger: Logger;
  ses: SESClient;
  fileService: FileService;
  templates: any;

  constructor({ fileService }) {
    this.logger = logger().child({ service: "SES" });
    this.ses = ses;
    this.fileService = fileService;
  }

  /**
   * @throws ApplicationError
   */
  async send(message: string) {
    try {
      return await this.ses.send(
        new SendRawEmailCommand({
          RawMessage: {
            Data: Buffer.from(message),
          },
        })
      );
    } catch (err: SESServiceException | any) {
      this.logger.error(err);
      throw new ApplicationError("SES", "API_ERROR", 400, err.message);
    }
  }

  static createTemplate(template: string) {
    return handlebars.compile(template);
  }
}
