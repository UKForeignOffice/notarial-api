import { SESService } from "./SESService";
import { NotifyService } from "./NotifyService";
import logger, { Logger } from "pino";

export class EmailService {
  logger: Logger;
  provider: NotifyService | SESService;

  constructor(serviceType: string, provider: NotifyService | SESService) {
    this.logger = logger().child({ service: serviceType });
    this.provider = provider;
  }

  sendEmail(args) {
    return this.provider.send(args);
  }
}
