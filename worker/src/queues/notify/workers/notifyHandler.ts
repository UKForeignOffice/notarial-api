import pino from "pino";
import { Job } from "pg-boss";

const queue = "notifications";
const worker = "notify";

const logger = pino();
export const metadata = { queue, worker };

/**
 * When a "submission" event is detected, this worker POSTs the data to `job.data.data.webhook_url`
 * The source of this event is the runner, after a user has submitted a form.
 */
export async function notifyHandler(job: Job) {
  const jobLogData = { jobId: job.id, ...metadata };
  logger.info(jobLogData, `received ${worker} job`);
}
