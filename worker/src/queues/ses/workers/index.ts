import { getConsumer } from "../../../Consumer";
import pino from "pino";
import PgBoss from "pg-boss";
import { sesHandler } from "./sesHandler";

const logger = pino();
const queue = "ses";

export async function setupSesQueueWorker() {
  const consumer: PgBoss = await getConsumer();

  logger.info({ queue }, `starting queue '${queue}' workers`);

  logger.info({ queue }, `starting 'sesHandler' on ${queue} listeners`);
  await consumer.work(queue, { newJobCheckInterval: 300 }, sesHandler);
}
