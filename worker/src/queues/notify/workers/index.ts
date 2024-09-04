import { getConsumer } from "../../../Consumer";
import pino from "pino";
import PgBoss from "pg-boss";
import { notifySendHandler } from "./notifySendHandler";
import { notifyProcessHandler } from "./notifyProcessHandler";
import { notifyFailureHandler } from "./notifyFailureHandler";

const logger = pino();
const SEND_QUEUE = "NOTIFY_SEND";
const PROCESS_QUEUE = "NOTIFY_PROCESS";
const FAILURE_CHECK_QUEUE = "NOTIFY_FAILURE_CHECK";

export async function setupNotifyWorker() {
  const consumer: PgBoss = await getConsumer();

  logger.info({ SEND_QUEUE }, `starting 'notifySendHandler' on ${SEND_QUEUE} listeners`);
  await consumer.work(SEND_QUEUE, { newJobCheckInterval: 500 }, notifySendHandler);

  logger.info({ PROCESS_QUEUE }, `starting 'notifyProcessHandler' on ${PROCESS_QUEUE} listeners`);
  await consumer.work(PROCESS_QUEUE, { newJobCheckInterval: 2000 }, notifyProcessHandler);

  logger.info({ FAILURE_CHECK_QUEUE }, `starting 'notifyFailureHandler' on ${FAILURE_CHECK_QUEUE} listeners`);
  await consumer.schedule(FAILURE_CHECK_QUEUE, `0 0 0 * *`);
  await consumer.work(FAILURE_CHECK_QUEUE, { newJobCheckInterval: 43200000 }, notifyFailureHandler);
}
