import pino from "pino";
import { Job } from "pg-boss";
import config from "config";
import { NotifyClient, SendEmailResponse } from "notifications-node-client";
import { NotifyJob } from "../types";

const queue = "NOTIFY_SEND";
const worker = "notifySendHandler";

const logger = pino().child({
  queue,
  worker,
});

const notifyClient = new NotifyClient(config.get<string>("Notify.apiKey"));

/**
 * When a "notify" event is detected, this worker uses the GOV.UK Notify client to send the email.
 * The source of this event is the runner, after a user has submitted a form.
 */
export async function notifySendHandler(job: Job<NotifyJob>) {
  const jobId = job.id;
  logger.info({ jobId }, `received ${worker} job`);
  const { data } = job;
  const { template, emailAddress, options } = data;

  try {
    const response = await notifyClient.sendEmail(template, emailAddress, options);
    const data = response.data as SendEmailResponse;
    const { id, reference } = data;
    logger.info({ jobId, reference, template }, "sent successfully");
    return id;
  } catch (e: any) {
    if (e.response) {
      logger.error({ jobId, err: e.response.data.errors, emailAddress }, "Notify responded with an error");
      throw e.response.data;
    }

    if (e.request) {
      logger.error(jobId, `Request could not be sent to Notify`);
    }
    throw e;
  }
}
