import { getConsumer } from "../../../Consumer";
import pino from "pino";
import PgBoss from "pg-boss";
import { notifyHandler } from "./notifyHandler";

const logger = pino();
const queue = "NOTIFY";

export async function setupNotifyWorker() {
  const consumer: PgBoss = await getConsumer();

  logger.info({ queue }, `starting queue '${queue}' workers`);

  logger.info({ queue }, `starting 'sesHandler' on ${queue} listeners`);
  await consumer.work(queue, { newJobCheckInterval: 500 }, notifyHandler);
}
