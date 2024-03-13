import { getConsumer } from "../../../Consumer";
import pino from "pino";
import PgBoss from "pg-boss";
import { notifyProcessHandler } from "./notifyProcessHandler";
import { notifySendHandler } from "../../notify/workers/notifySendHandler";

const logger = pino();
const SEND_QUEUE = "SES_SEND";
const PROCESS_QUEUE = "SES_PROCESS";

export async function setupSesQueueWorker() {
  const consumer: PgBoss = await getConsumer();

  logger.info({ SEND_QUEUE }, `starting 'sesSendHandler' on ${SEND_QUEUE} listeners`);
  await consumer.work(SEND_QUEUE, { newJobCheckInterval: 500 }, notifySendHandler);

  logger.info({ PROCESS_QUEUE }, `starting 'sesProcessHandler' on ${PROCESS_QUEUE} listeners`);
  await consumer.work(PROCESS_QUEUE, { newJobCheckInterval: 2000 }, notifyProcessHandler);
}
