import pino from "pino";
import { Job } from "pg-boss";
import axios from "axios";
import config from "config";
import { PayMetadata } from "../../../types";

const queue = "NOTIFY_PROCESS";
const worker = "notifyProcessHandler";

const logger = pino().child({
  queue,
  worker,
});

const CREATE_NOTIFY_EMAIL_URL = config.get<string>("NotarialApi.createNotifyEmailUrl");
type NotifyParseJob = {
  answers: any;
  metadata: { reference: string; payment?: PayMetadata; type: string };
};
/**
 * When a "NOTIFY_PARSE" event is detected, this worker simply POSTs the data back to the notarial-api/forms/emails/user
 * The source of this event is the notarial-api, after the user has submitted a form. The purpose of this handler is
 * to simply store the data required to create an SES event, and be able to edit it simply.
 */
export async function notifyProcessHandler(job: Job<NotifyParseJob>) {
  const jobId = job.id;
  logger.info({ jobId }, `received ${worker} job`);

  const { data, id } = job;
  const reference = data.metadata.reference;
  try {
    const res = await axios.post(CREATE_NOTIFY_EMAIL_URL, data);

    logger.info(
      { jobId, reference },
      `job: ${id} posted successfully to ${CREATE_NOTIFY_EMAIL_URL} for user with reference ${reference}. Email will be sent by ${res.data.jobId}`
    );

    return res.data.jobId;
  } catch (e: any) {
    logger.error({ jobId, err: e }, `post to ${CREATE_NOTIFY_EMAIL_URL} job: ${id} failed with ${e.cause ?? e.message}`);

    if (e.response) {
      logger.error({ jobId, err: e.response.error });
      const { message, name, code, response } = e;
      const { status, data } = response;
      throw {
        message,
        name,
        code,
        status,
        data,
      };
    }

    if (e.request) {
      logger.error(jobId, `post to ${CREATE_NOTIFY_EMAIL_URL} request could not be sent, see database for error`);
    }

    // @ts-ignore
    if (e.cause instanceof AggregateError) {
      throw { errors: e.cause.errors };
    }
    throw e;
  }
}
