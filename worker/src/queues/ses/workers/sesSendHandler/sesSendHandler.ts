import pino from "pino";
import { Job } from "pg-boss";
import { SESJob } from "../../types";
import { sesClient, SESEmail } from "../../helpers";

import { SendEmailCommand, SESv2ServiceException } from "@aws-sdk/client-sesv2";
import { SES_SEND_ERRORS } from "../errors";
import { sendAlertToPost } from "./sendAlertToPost";

const queue = "SES_SEND";
const worker = "sesSendHandler";

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

  const emailCommand = new SendEmailCommand({
    Content: {
      Raw: {
        Data: Buffer.from(message.asRaw()),
      },
    },
  });

  let response;

  try {
    response = await sesClient.send(emailCommand);
    logger.info(`Reference ${reference} staff email sent successfully with SES message id: ${response.MessageId}`);
  } catch (err: SESv2ServiceException | any) {
    logger.error({ jobId, reference, err, errorCode: SES_SEND_ERRORS.SES }, "SES could not send the email");
    throw err;
  }

  if (data.onComplete) {
    await sendAlertToPost(jobId, data.onComplete);
  }

  return response;
}
