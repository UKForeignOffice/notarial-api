import { notifySendHandler } from "./notifySendHandler";
import { notifyProcessHandler } from "./notifyProcessHandler";
import { notifyFailureHandler } from "./notifyFailureHandler";
import config from "config";
import * as consumer from "../../../Consumer";

const SEND_QUEUE = "NOTIFY_SEND";
const PROCESS_QUEUE = "NOTIFY_PROCESS";
const FAILURE_CHECK_QUEUE = "NOTIFY_FAILURE_CHECK";

export async function setupNotifyWorker() {
  await consumer.startListener(PROCESS_QUEUE, notifyProcessHandler);
  await consumer.startListener(SEND_QUEUE, notifySendHandler);

  const failureConsumerCheckInterval = 60 * 60 * 12;
  await consumer.startListener(FAILURE_CHECK_QUEUE, notifyFailureHandler, { pollingIntervalSeconds: failureConsumerCheckInterval });
  await consumer.scheduleWork(FAILURE_CHECK_QUEUE, config.get<string>("Notify.failureCheckSchedule"));
}
