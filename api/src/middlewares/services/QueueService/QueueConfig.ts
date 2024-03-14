import config from "config";
import logger from "pino";
import { SendOptions } from "pg-boss";

export type QueueName = "SES_PROCESS" | "SES_SEND" | "NOTIFY_PROCESS" | "NOTIFY_SEND";

const DEFAULT_OPTIONS = {
  retryBackoff: config.get<string>("Queue.defaultOptions.retryBackoff") === "true",
  retryLimit: parseInt(config.get<string>("Queue.defaultOptions.retryLimit")),
};
const QueueLogger = logger();

export class QueueConfig {
  options: SendOptions = DEFAULT_OPTIONS;
  name: QueueName;
  constructor(name: QueueName) {
    this.name = name;

    try {
      this.options = {
        retryBackoff: config.get<string>(`Queue.${name}.retryBackoff`) === "true",
        retryLimit: parseInt(config.get<string>(`Queue.${name}.retryLimit`)),
        onComplete: config.get<string>(`Queue.${name}.onComplete`) === "true",
      };
    } catch (e) {
      QueueLogger.warn(`${name} options could not be set, using default options`);
    }
  }
}
