import { getConsumer } from "./getConsumer";

import pino from "pino";
const logger = pino();

export async function scheduleWork(queue: string, cron: string) {
  const consumer = await getConsumer();
  logger.info({ queue }, `Creating schedule ${cron} on ${queue}`);
  await consumer.schedule(queue, cron);
}
