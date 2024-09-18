import { SESJob } from "../../types";
import { getConsumer } from "../../../../Consumer";
import { SES_SEND_ERRORS } from "../errors";
import pino from "pino";

const queue = "SES_SEND";
const worker = "sesSendHandler";

const logger = pino().child({
  queue,
  worker,
});

/**
 * Sends an alert to individual posts, notifying them that a form has been submitted to the shared inbox.
 */
export async function sendAlertToPost(completedJobId: string, data: SESJob["onComplete"]) {
  if (!data) {
    logger.warn({ completedJobId }, "sendAlertToPost was triggered, but onComplete data is empty");
    return;
  }

  const consumer = await getConsumer();
  logger.info({ completedJobId }, `completed ${completedJobId} on ${worker}, sending alert to post`);

  try {
    await consumer.send(data.queue, data.job);
  } catch (e) {
    logger.error(
      {
        completedJobId,
        err: e,
        errorCode: SES_SEND_ERRORS.ON_COMPLETE,
      },
      `Failed to send onComplete ${queue} job triggered by ${completedJobId}`
    );
    throw e;
  }
}
