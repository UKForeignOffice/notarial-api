import config from "config";
import logger from "pino";
import { SendOptions } from "pg-boss";
import joi from "joi";

export type QueueName = "SES_PROCESS" | "SES_SEND" | "NOTIFY_PROCESS" | "NOTIFY_SEND";

const DEFAULT_OPTIONS = {
  retryBackoff: config.get<string>("Queue.defaultOptions.retryBackoff") === "true",
  retryLimit: parseInt(config.get<string>("Queue.defaultOptions.retryLimit")),
};
const queueLogger = logger();

export const schema = joi.object({
  retryBackoff: joi.boolean().optional(),
  retryLimit: joi.number().optional(),
  onComplete: joi.boolean().default(false),
});

export class QueueConfig {
  options: SendOptions = DEFAULT_OPTIONS;
  name: QueueName;
  constructor(name: QueueName) {
    this.name = name;

    try {
      const { value } = schema.validate(config.get<SendOptions>(`Queue.${name}`), { convert: true });
      this.options = value;
      queueLogger.info({ value }, `${this.name} queue configured`);
    } catch (e) {
      queueLogger.warn(`${name} options could not be set, using default options`);
      this.options = DEFAULT_OPTIONS;
    }
  }
}
