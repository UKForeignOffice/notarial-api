import pino from "pino";
import { Job } from "pg-boss";
import { SESJob } from "../types";
import { sesClient, SESEmail } from "../helpers";

import { SESServiceException, SendRawEmailCommand } from "@aws-sdk/client-ses";

const queue = "SES";
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
export async function sesHandler(job: Job<SESJob>) {
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

  try {
    const response = await sesClient.send(emailCommand);
    logger.info(`Reference ${reference} staff email sent successfully with SES message id: ${response.MessageId}`);
    return response;
  } catch (err: SESServiceException | any) {
    logger.error({ jobId, reference, err }, "SES could not send the email");
    throw err;
  }
}
