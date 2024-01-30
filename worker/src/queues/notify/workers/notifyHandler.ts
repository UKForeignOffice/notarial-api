import pino from "pino";
import { Job } from "pg-boss";
import config from "config";
import { NotifyClient, RequestError, SendEmailOptions, SendEmailResponse } from "notifications-node-client";

const queue = "notifications";
const worker = "notify";

const logger = pino().child({
  queue,
  worker,
});

const notifyClient = new NotifyClient(config.get<string>("Notify.apiKey"));

type NotifyJob = {
  data: {
    template: string;
    emailAddress: string;
    options: SendEmailOptions<any>;
  };
};

/**
 * When a "notifications" event is detected, this worker POSTs the data to `job.data.data.webhook_url`
 * The source of this event is the runner, after a user has submitted a form.
 */
export async function notifyHandler(job: Job<NotifyJob>) {
  const jobId = job.id;
  logger.info({ jobId }, `received ${worker} job`);
  const { data } = job.data;
  const { template, emailAddress, options } = data;
  try {
    const response = await notifyClient.sendEmail(template, emailAddress, options);
    const data = response.data as SendEmailResponse;
    const { id, reference } = data;
    logger.info({ jobId, reference, template }, "sent successfully");
    return id;
  } catch (e) {
    /*if (!e.resonse)
    const isNotifyError = "data" in response && response.data.errors;
    if (isNotifyError) {
      const notifyErrors = response.data.errors as RequestError[];
      throw new ApplicationError("NOTIFY", "API_ERROR", 500, JSON.stringify(notifyErrors));
    }
throw new ApplicationError("NOTIFY", "UNKNOWN", 500, error.message);
   */
  }
}
