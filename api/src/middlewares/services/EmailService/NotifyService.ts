import { NotifyClient, RequestError, SendEmailResponse } from "notifications-node-client";
import config from "config";
import pino, { Logger } from "pino";
import { ApplicationError } from "../../../ApplicationError";

export interface NotifyMailModel {
  template: string;
  emailAddress: string;
  options: {
    personalisation: object;
    reference: string;
  };
}
export class NotifyService {
  notify: NotifyClient;
  logger: Logger;
  templates = {};
  constructor() {
    this.logger = pino().child({ service: "Notify" });
    const apiKey = config.get("notifyApiKey");
    if (!apiKey) {
      throw new ApplicationError("NOTIFY", "NO_API_KEY", 500);
    }
    this.notify = new NotifyClient(apiKey as string);
  }

  async send({ template, emailAddress, options }: NotifyMailModel) {
    try {
      const response = await this.notify.sendEmail(template, emailAddress, options);
      return response.data as SendEmailResponse;
    } catch (e) {
      this.handleError(e);
    }
    return;
  }

  handleError(error: any) {
    const { response = {} } = error;
    const isNotifyError = "data" in response && response.data.errors;
    if (isNotifyError) {
      const notifyErrors = response.data.errors as RequestError[];
      throw new ApplicationError("NOTIFY", "API_ERROR", 500, JSON.stringify(notifyErrors));
    }
    throw new ApplicationError("NOTIFY", "UNKNOWN", 500, error.message);
  }
}
