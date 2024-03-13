import { getConsumer } from "../../../Consumer";
import pino from "pino";
import PgBoss from "pg-boss";
import { notifyHandler } from "./notifyHandler";
import { notifyParserHandler } from "./notifyParserHandler";

const logger = pino();
const SEND_QUEUE = "NOTIFY_SEND";
const PROCESS_QUEUE = "NOTIFY_PROCESS";

export async function setupNotifyWorker() {
  const consumer: PgBoss = await getConsumer();

  logger.info({ SEND_QUEUE }, `starting 'sesHandler' on ${SEND_QUEUE} listeners`);
  await consumer.work(SEND_QUEUE, { newJobCheckInterval: 500 }, notifyHandler);

  logger.info({ PROCESS_QUEUE }, `starting 'notifyParserHandler' on ${PROCESS_QUEUE} listeners`);
  await consumer.work(PROCESS_QUEUE, { newJobCheckInterval: 2000 }, notifyParserHandler);
}
