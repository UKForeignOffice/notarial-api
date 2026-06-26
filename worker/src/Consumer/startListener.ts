import PgBoss, { WorkHandler, WorkOptions } from "pg-boss";
import { drainQueue } from "./migrate";
import { getConsumer } from "./getConsumer";
import pino from "pino";
import config from "config";
const logger = pino();

const DEADLOCK_ERROR_CODE = "40P01";
const CREATE_QUEUE_ATTEMPTS = 5;

async function createQueueWithRetry(consumer: PgBoss, queueName: string) {
  for (let attempt = 1; attempt <= CREATE_QUEUE_ATTEMPTS; attempt++) {
    try {
      await consumer.createQueue(queueName);
      return;
    } catch (err: any) {
      const isDeadlock = err?.code === DEADLOCK_ERROR_CODE;
      const isLastAttempt = attempt === CREATE_QUEUE_ATTEMPTS;

      if (!isDeadlock || isLastAttempt) {
        throw err;
      }

      logger.warn({ queue: queueName, attempt, err }, "Deadlock detected while creating queue. Retrying.");
      await new Promise((resolve) => setTimeout(resolve, attempt * 500));
    }
  }
}

export async function startListener<T>(queueName: string, handler: WorkHandler<T>, options: WorkOptions = {}) {
  const consumer: PgBoss = await getConsumer();

  logger.info({ queue: queueName, options }, `Creating queue ${queueName}`);
  await createQueueWithRetry(consumer, queueName);

  if (config.has("Queue.drainSchema")) {
    const queueDrainSchema = config.get<"string">("Queue.drainSchema");
    logger.info({ queue: queueName, options, queueDrainSchema }, `QUEUE_DRAIN_SCHEMA detected. Attempting to drain queue on ${queueDrainSchema}`);

    try {
      await drainQueue(queueName, queueDrainSchema);
    } catch (err) {
      logger.error({ queue: queueName, err }, `Draining of ${queueName} on ${queueDrainSchema} failed`);
    }
  }

  logger.info({ queue: queueName, options }, `Creating listener '${handler.name}' on ${queueName}`);

  await consumer.work(queueName, options, handler);
}
