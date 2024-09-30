import PgBoss, { WorkHandler, WorkOptions } from "pg-boss";
import { drainQueue } from "./migrate";
import { getConsumer } from "./getConsumer";
import pino from "pino";
import config from "config";
const logger = pino();

export async function startListener<T>(queueName: string, handler: WorkHandler<T>, options: WorkOptions = {}) {
  const consumer: PgBoss = await getConsumer();

  logger.info({ queue: queueName, options }, `Creating queue ${queueName}`);
  await consumer.createQueue(queueName);

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
