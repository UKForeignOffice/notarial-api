import { WorkHandler, WorkOptions } from "pg-boss";
import { getConsumer } from "./getConsumer";
import pino from "pino";
const logger = pino();

export async function startListener<T>(queueName: string, handler: WorkHandler<T>, options?: WorkOptions) {
  const consumer = await getConsumer();

  logger.info({ queue: queueName, options }, `Creating queue ${queueName}`);
  await consumer.createQueue(queueName);

  logger.info({ queue: queueName, options }, `Creating listener '${handler.name}' on ${queueName}`);

  if (options) {
    await consumer.work(queueName, options, handler);
    return;
  }

  await consumer.work(queueName, handler);
}
