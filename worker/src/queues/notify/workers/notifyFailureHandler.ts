import pino from "pino";
import { Job } from "pg-boss";
import { NotifyClient, Status, ErrorResponse, GetNotificationsResponse } from "notifications-node-client";
import config from "config";
import { NOTIFY_FAILURE_ERRORS } from "./errors";

const queue = "NOTIFY_FAILURE_CHECK";
const worker = "notifyFailureHandler";

const logger = pino().child({
  queue,
  worker,
});

const notifyClient = new NotifyClient(config.get<string>("Notify.apiKey"));

export async function notifyFailureHandler(job: Job) {
  const jobId = job.id;
  logger.info({ jobId }, `received ${worker} job`);
  try {
    const responses = await getFailureResponses();
    const failures = responses
      .flatMap((response, index) => {
        if (response.status !== 200) {
          logger.warn(`Could not fetch email failures for status: ${failureStatuses[index]}`);
          return [];
        }
        return (response.data as GetNotificationsResponse).notifications;
      })
      .filter((failure) => failure);
    if (failures.length > 0) {
      failures.forEach((failure) => {
        logger.warn(
          {
            jobId,
            errorCode: "NOTIFY_EMAIL_FAILURE_TO_SEND",
          },
          `Received user confirmation email send error from Notify. Reference: ${failure.reference}`
        );
      });
      return;
    }
    logger.info({ jobId }, `No email failures found in Notify failure check run.`);
    return;
  } catch (err) {
    logger.error(
      {
        jobId,
        errorCode: NOTIFY_FAILURE_ERRORS.REQUEST,
        err,
      },
      `Could not retrieve email failure information from Notify.`
    );
  }
}

const failureStatuses: Status[] = ["permanent-failure", "temporary-failure", "technical-failure"];

type notifyResponse = {
  status: number;
  data: GetNotificationsResponse | ErrorResponse;
};

async function getFailureResponses() {
  let responses: notifyResponse[] = [];
  for (const status of failureStatuses) {
    responses.push(await notifyClient.getNotifications("email", status));
  }
  return responses;
}
