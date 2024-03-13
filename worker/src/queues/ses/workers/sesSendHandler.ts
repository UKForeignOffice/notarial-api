import pino from "pino";
import { Job } from "pg-boss";
import { SESJob } from "../types";
import { sesClient, SESEmail } from "../helpers";

import { SESServiceException, SendRawEmailCommand } from "@aws-sdk/client-ses";
import { getConsumer } from "../../../Consumer";

const queue = "SES_SEND";
const worker = "sesHandler";

const logger = pino().child({
  queue,
  worker,
});

/**
 * When an "SES" event is detected, this worker creates a MIMEMessage, downloads and attaches files to it, then sends it
 * with SES`
 * The source of this event is the runner, after a user has submitted a form.
 */
export async function sesSendHandler(job: Job<SESJob>) {
  const jobId = job.id;
  logger.info({ jobId }, `received ${worker} job`);
  const { data } = job;
  const { subject, body, attachments, reference } = data;

  const message = SESEmail.createMessageWithText(subject, body);

  try {
    await SESEmail.attachFilesToMessage(attachments, message);
  } catch (err) {
    logger.error({ jobId, reference, err }, "Failed to attach messages");
    throw err;
  }

  const emailCommand = new SendRawEmailCommand({
    RawMessage: {
      Data: Buffer.from(message.asRaw()),
    },
  });

  let response;

  try {
    response = await sesClient.send(emailCommand);
    logger.info(`Reference ${reference} staff email sent successfully with SES message id: ${response.MessageId}`);
  } catch (err: SESServiceException | any) {
    logger.error({ jobId, reference, err }, "SES could not send the email");
    throw err;
  }

  sendAlertToPost(job);
  return response;
}

/**
 * Sends an alert to individual posts, notifying them that a form has been submitted to the shared inbox.
 */
export async function sendAlertToPost(job: Job<SESJob>) {
  const jobId = job.id;
  logger.info({ jobId }, `completed ${jobId} on ${worker}. Creating NOTIFY job to alert staff`);

  const consumer = await getConsumer();
  try {
    await consumer.send("NOTIFY_SEND", job.data.postAlertOptions);
  } catch (e) {
    logger.error({ jobId, err: e }, `Failed to send NOTIFY job to alert staff for ${jobId}`);
  }
}
