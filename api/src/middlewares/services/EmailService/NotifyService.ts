import { NotifyClient } from "notifications-node-client";
import config from "config";
import pino, { Logger } from "pino";
import { ApplicationError } from "../../../ApplicationError";

export class NotifyService {
  notify: NotifyClient;
  logger: Logger;
  constructor() {
    this.logger = pino().child({ service: "Notify" });
    const apiKey = config.get("notifyApiKey");
    if (!apiKey) {
      throw new ApplicationError("NOTIFY", "NO_API_KEY", 500);
    }
    this.notify = new NotifyClient(apiKey as string);
  }
}
