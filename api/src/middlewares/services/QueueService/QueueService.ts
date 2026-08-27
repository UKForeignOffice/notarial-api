import logger, { Logger } from "pino";
import PgBoss from "pg-boss";
import config from "config";
import { ApplicationError } from "../../../ApplicationError";
import { QueueConfig, QueueName } from "./QueueConfig";

const DEADLOCK_ERROR_CODE = "40P01";
const CREATE_QUEUE_ATTEMPTS = 5;

type JobWithMetadata<T = {}> = T & {
  reference?: string;
  metadata?: { reference: string };
};
export class QueueService {
  logger: Logger;
  boss: PgBoss;
  configs: Record<QueueName, QueueConfig>;

  constructor() {
    this.logger = logger().child({ service: "Queue" });
    const boss = new PgBoss({
      connectionString: config.get<string>("Queue.url"),
      schema: config.get<string>("Queue.schema"),
    });
    this.boss = boss;

    this.configs = {
      SES_PROCESS: new QueueConfig("SES_PROCESS"),
      SES_SEND: new QueueConfig("SES_SEND"),
      NOTIFY_SEND: new QueueConfig("NOTIFY_SEND"),
      NOTIFY_PROCESS: new QueueConfig("NOTIFY_PROCESS"),
    };
    boss.start().then(async () => {
      this.logger.info("Creating queues");
      await this.createQueues();
    }).catch((err) => {
      this.logger.error({ err }, "Queue startup failed");
      throw err;
    });
  }

  async createQueueWithRetry(queueName: string) {
    for (let attempt = 1; attempt <= CREATE_QUEUE_ATTEMPTS; attempt++) {
      try {
        await this.boss.createQueue(queueName);
        return;
      } catch (err: any) {
        const isDeadlock = err?.code === DEADLOCK_ERROR_CODE;
        const isLastAttempt = attempt === CREATE_QUEUE_ATTEMPTS;

        if (!isDeadlock || isLastAttempt) {
          throw err;
        }

        this.logger.warn({ queueName, attempt, err }, "Deadlock detected while creating queue. Retrying.");
        await new Promise((resolve) => setTimeout(resolve, attempt * 500));
      }
    }
  }

  async createQueues() {
    const configs = Object.keys(this.configs);
    for (const key of configs) {
      this.logger.info(`Creating queue ${key}`);
      await this.createQueueWithRetry(key);
    }
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
