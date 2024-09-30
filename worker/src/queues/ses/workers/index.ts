import * as consumer from "../../../Consumer";
import { sesSendHandler } from "./sesSendHandler";
import { sesProcessHandler } from "./sesProcessHandler";

const SEND_QUEUE = "SES_SEND";
const PROCESS_QUEUE = "SES_PROCESS";

export async function setupSesQueueWorker() {
  await consumer.startListener(SEND_QUEUE, sesSendHandler, { pollingIntervalSeconds: 0.5 });
  await consumer.startListener(PROCESS_QUEUE, sesProcessHandler);
}
