import { getConsumer } from "../../../Consumer";
import pino from "pino";
import PgBoss from "pg-boss";
import { sesHandler } from "./sesHandler";
import { notifyHandler } from "./notifyHandler";

const logger = pino();
const queue = "notification";

export async function setupSubmissionWorkers() {
  const consumer: PgBoss = await getConsumer();

  logger.info({ queue }, `starting queue '${queue}' workers`);

  logger.info({ queue }, `starting 'sesHandler' on ${queue} listeners`);
  await consumer.work(queue, { newJobCheckInterval: 500 }, sesHandler);

  logger.info({ queue }, `starting 'notifyHandler' on ${queue} listeners`);
  await consumer.work(queue, { newJobCheckInterval: 500 }, notifyHandler);
}
