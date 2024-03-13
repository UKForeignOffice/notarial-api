import pino from "pino";
import { Job } from "pg-boss";
import axios from "axios";
import config from "config";
import { SESParseJob } from "../types";

const queue = "SES_PROCESS";
const worker = "sesParserHandler";

const logger = pino().child({
  queue,
  worker,
});

const CREATE_SES_EMAIL_URL = config.get<string>("NotarialApi.createStaffEmailUrl");

/**
 * When an "SES_PARSER" event is detected, this worker simply POSTs the data back to the notarial-api/forms/emails/staff
 * The source of this event is the notarial-api, after the user has submitted a form. The purpose of this handler is
 * to simply store the data required to create an SES event.
 */
export async function sesParserHandler(job: Job<SESParseJob>) {
  const jobId = job.id;
  logger.info({ jobId }, `received ${worker} job`);

  const { data, id } = job;
  const reference = data.metadata.reference;
  try {
    const res = await axios.post(CREATE_SES_EMAIL_URL, data);
    // @ts-ignore

    if (reference) {
      logger.info(
        { jobId, reference },
        `job: ${id} posted successfully to ${CREATE_SES_EMAIL_URL} for user with reference ${reference}. Email will be sent by ${res.data.jobId}`
      );
      return reference;
    }
    return;
  } catch (e: any) {
    logger.error({ jobId }, `post to ${CREATE_SES_EMAIL_URL} job: ${id} failed with ${e.cause ?? e.message}`);
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
      logger.error(jobId, `post to ${CREATE_SES_EMAIL_URL} request could not be sent, see database for error`);
    }

    // @ts-ignore
    if (e.cause instanceof AggregateError) {
      throw { errors: e.cause.errors };
    }
    throw e;
  }
}
