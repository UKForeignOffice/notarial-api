import logger, { Logger } from "pino";
import PgBoss from "pg-boss";
import config from "config";
import { ApplicationError } from "../../../ApplicationError";
import { QueueConfig, QueueName } from "./QueueConfig";

type JobWithMetadata<T = {}> = T & {
  reference?: string;
  metadata?: { reference: string };
};
export class QueueService {
  logger: Logger;
  boss?: PgBoss;
  configs: Record<QueueName, QueueConfig>;

  constructor() {
    this.logger = logger().child({ service: "Queue" });
    const boss = new PgBoss({
      connectionString: config.get<string>("Queue.url"),
    });
    this.configs = {
      SES_PROCESS: new QueueConfig("SES_PROCESS"),
      SES_SEND: new QueueConfig("SES_SEND"),
      NOTIFY_SEND: new QueueConfig("NOTIFY_PROCESS"),
      NOTIFY_PROCESS: new QueueConfig("NOTIFY_PROCESS"),
    };
    boss.start().then((pgboss) => {
      this.boss = pgboss;
    });
  }

  async sendToQueue<T>(queueName: QueueName, data: JobWithMetadata<T>) {
    const queue = this.configs[queueName];
    const jobId = await this.boss?.send?.(queueName, data, queue.options);
    if (!jobId) {
      throw new ApplicationError("QUEUE", `${queueName}_ERROR`, 500, `Queueing failed for user: ${data.metadata?.reference ?? data?.reference}`);
    }
    return jobId;
  }
}
