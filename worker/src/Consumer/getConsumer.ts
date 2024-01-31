import config from "config";
import PgBoss from "pg-boss";
import { ApplicationError } from "../utils/ApplicationError";
import pino from "pino";

const DEFAULT_URL = config.get<string>("Queue.url");
const logger = pino().child({
  method: "Consumer.create",
});
const MINUTE_IN_S = 60;
const HOUR_IN_S = MINUTE_IN_S * 60;
const DAY_IN_S = HOUR_IN_S * 24;

const archiveFailedAfterDays = parseInt(config.get<string>("Queue.archiveFailedInDays"));
const deleteAfterDays = parseInt(config.get<string>("Queue.deleteArchivedAfterDays"));

logger.info(`archiveFailedAfterDays: ${archiveFailedAfterDays}, deleteAfterDays: ${deleteAfterDays}`);

let consumer;

export async function create(url: string = DEFAULT_URL) {
  logger.info(`Starting consumer at ${url}`);
  const boss = new PgBoss({
    connectionString: url,
    archiveFailedAfterSeconds: archiveFailedAfterDays * DAY_IN_S,
    deleteAfterDays,
  });

  boss.on("error", (error) => {
    throw error;
  });

  try {
    await boss.start();
  } catch (e: any) {
    throw new ApplicationError("CONSUMER", "START_FAILED", `Failed to start listener ${e.message}. Exiting`);
  }

  logger.info({ method: "Consumer.create" }, `Successfully started consumer at ${url}`);
  return boss;
}

export async function getConsumer() {
  try {
    if (!consumer) {
      const boss = await create();
      consumer = boss;
    }
    return consumer;
  } catch (e) {
    logger.error(e);
    process.exit(1);
  }
}
