import pino from "pino";
import { Job } from "pg-boss";

const queue = "notifications";
const worker = "ses";

const logger = pino().child({
  queue,
  worker,
});

interface FormField {
  key: string;
  title: string;
  type: string;
  answer: string | boolean | null;
}

type SESJob = {
  data: {
    subject: string;
    body: string;
    attachments: FormField[];
    reference: string;
  };
};
/**
 * When a "submission" event is detected, this worker POSTs the data to `job.data.data.webhook_url`
 * The source of this event is the runner, after a user has submitted a form.
 */
export async function sesHandler(job: Job<SESJob>) {
  const jobId = job.id;
  logger.info({ jobId }, `received ${worker} job`);

  const { data } = job.data;
  const { subject, body, attachments, reference } = data;
  console.log(subject, body, attachments, reference);
}
