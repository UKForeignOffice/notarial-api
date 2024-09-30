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

export async function notifyFailureHandler([job]: Job[]) {
  const jobId = job.id;
  logger.info({ jobId }, `received ${worker} job`);
  const failureCheckDate = new Date();
  failureCheckDate.setDate(failureCheckDate.getDate() - 1);
  const failures = await getFailureResponses(jobId, failureCheckDate);
  if (failures.length === 0) {
    logger.info({ jobId }, `No email failures found in Notify failure check run.`);
    return;
  }
  logger.warn(
    {
      jobId,
      errorCode: "NOTIFY_EMAIL_FAILURE_TO_SEND",
    },
    `Found ${failures.length} failed notify sends since ${failureCheckDate.toDateString()}. Check output for reference numbers.`
  );
  return failures.map((failure) => ({ reference: failure.reference, emailAddress: failure.email_address }));
}

const failureStatuses: Status[] = ["permanent-failure", "temporary-failure", "technical-failure"];

async function getFailureResponses(jobId: string, failureCheckDate: Date) {
  let responses: GetNotificationByIdResponse[] = [];
  for (const status of failureStatuses) {
    try {
      const { data } = await notifyClient.getNotifications("email", status);
      if (isGetNotificationsResponse(data)) {
        responses = responses.concat(data.notifications);
        continue;
      }
      logger.warn(`Could not fetch email failures for status: ${status}`);
    } catch (err) {
      logger.error(
        {
          jobId,
          errorCode: NOTIFY_FAILURE_ERRORS.REQUEST,
          err,
        },
        `Could not retrieve email failure information from Notify.`
      );
      throw err;
    }
  }
  return responses.filter((response) => new Date(response.completed_at) >= failureCheckDate);
}

function isGetNotificationsResponse(response: ErrorResponse | GetNotificationsResponse): response is GetNotificationsResponse {
  return response.hasOwnProperty("notifications");
}
