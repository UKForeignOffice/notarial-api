import pino from "pino";
import { Job } from "pg-boss";
import { NotifyClient, Status, GetNotificationsResponse, GetNotificationByIdResponse, ErrorResponse } from "notifications-node-client";
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
  const failures = await getFailureResponses();
  if (failures.length === 0) {
    logger.info({ jobId }, `No email failures found in Notify failure check run.`);
    return;
  }
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

const failureStatuses: Status[] = ["permanent-failure", "temporary-failure", "technical-failure"];

async function getFailureResponses() {
  let responses: GetNotificationByIdResponse[] = [];
  for (const status of failureStatuses) {
    try {
      const { data } = await notifyClient.getNotifications("email", status);
      if (isGetNotificationsResponse(data)) {
        responses.concat(data.notifications);
      }
    } catch (err) {
      logger.warn(`Could not fetch email failures for status: ${status}`);
    }
  }
  return responses;
}

function isGetNotificationsResponse(response: ErrorResponse | GetNotificationsResponse): response is GetNotificationsResponse {
  return response.hasOwnProperty("notifications");
}
