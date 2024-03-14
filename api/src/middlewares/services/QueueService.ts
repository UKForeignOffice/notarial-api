import logger, { Logger } from "pino";
import PgBoss, { SendOptions } from "pg-boss";
import config from "config";
import { ApplicationError } from "../../ApplicationError";

type QueueName = "SES_PROCESS" | "SES_SEND" | "NOTIFY_PROCESS" | "NOTIFY_SEND";

const DEFAULT_OPTIONS = {
  retryBackoff: config.get<string>("Queue.defaultOptions.retryBackoff") === "true",
  retryLimit: parseInt(config.get<string>("Queue.defaultOptions.retryLimit")),
};

class Queue {
  options: SendOptions = DEFAULT_OPTIONS;
  name: QueueName;
  constructor(name: QueueName, options?: SendOptions) {
    this.name = name;
    if (options) {
      this.options = options;
    }
  }
}
type JobWithMetadata<T = {}> = T & {
  reference?: string;
  metadata?: { reference: string };
};
export class QueueService {
  logger: Logger;
  boss?: PgBoss;
  queues: Record<QueueName, Queue>;

  constructor() {
    this.logger = logger().child({ service: "Queue" });
    const boss = new PgBoss({
      connectionString: config.get<string>("Queue.url"),
    });
    this.queues = {
      SES_PROCESS: new Queue("SES_PROCESS"),
      SES_SEND: new Queue("SES_SEND"),
      NOTIFY_SEND: new Queue("SES_PROCESS"),
      NOTIFY_PROCESS: new Queue("NOTIFY_PROCESS"),
    };
    boss.start().then((pgboss) => {
      this.boss = pgboss;
      // this.logger.info(
      //   `Sending messages to ${this.QUEUE_NAME} or ${this.PROCESS_QUEUE_NAME}. Ensure that there is a handler listening to ${this.QUEUE_NAME} and ${this.PROCESS_QUEUE_NAME}`
      // );
    });
  }

  async sendToQueue<T>(queue: QueueName, data: JobWithMetadata<T>) {
    const q = this.queues[queue];
    const jobId = await this.boss?.send?.(queue, data, q.options);
    if (!jobId) {
      throw new ApplicationError("QUEUE", `${queue}_ERROR`, 500, `Queueing failed for user: ${data.metadata?.reference ?? data?.reference}`);
    }
    return jobId;
  }
}
