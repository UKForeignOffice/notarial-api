import config from "config";
import pino, { Logger } from "pino";
import { ApplicationError } from "../../../ApplicationError";
import { NotifyEmailTemplate, NotifySendEmailArgs } from "./types";
import { AnswersHashMap } from "../../../types/AnswersHashMap";
import PgBoss from "pg-boss";
import { getPostEmailAddress } from "./utils/getPostEmailAddress";
import { PayMetadata } from "../../../types/FormDataBody";
import { PersonalisationBuilder } from "./templates/notify/PersonalisationBuilder";

export class NotifyService {
  logger: Logger;
  templates: Record<NotifyEmailTemplate, string>;
  queue?: PgBoss;
  QUEUE_NAME = "NOTIFY";
  queueOptions: {
    retryBackoff: boolean;
    retryLimit: number;
  };
  constructor() {
    this.logger = pino().child({ service: "Notify" });
    try {
      const userConfirmation = config.get<string>("Notify.Template.userConfirmation");
      const postNotification = config.get<string>("Notify.Template.postNotification");
      this.templates = {
        userConfirmation,
        postNotification,
      };
    } catch (err) {
      this.logger.error({ err }, "Notify templates have not been configured, exiting");
      process.exit(1);
    }

    try {
      const retryBackoff = config.get<string>("Notify.Retry.backoff") === "true";
      const retryLimit = parseInt(config.get<string>("Notify.Retry.limit"));
      this.queueOptions = {
        retryBackoff,
        retryLimit,
      };
      this.logger.info(`${this.QUEUE_NAME} jobs will retry with retryBackoff: ${retryBackoff}, retryLimit: ${retryLimit}`);
    } catch (err) {
      this.logger.error({ err }, "Retry options could not be set, exiting");
      process.exit(1);
    }

    const queue = new PgBoss({
      connectionString: config.get<string>("Queue.url"),
    });

    queue.start().then((pgboss) => {
      this.queue = pgboss;
      this.logger.info(`Sending messages to ${this.QUEUE_NAME}. Ensure that there is a handler listening to ${this.QUEUE_NAME}`);
    });
  }

  async sendEmailToUser(answers: AnswersHashMap, metadata: { reference: string; payment?: PayMetadata }) {
    const { reference } = metadata;
    const personalisation = PersonalisationBuilder.userConfirmation(answers, metadata);
    const emailArgs = {
      template: this.templates.userConfirmation,
      emailAddress: answers.emailAddress as string,
      options: {
        personalisation,
        reference,
      },
    };
    return this.sendEmail(emailArgs, reference);
  }

  async sendEmail({ template, emailAddress, options }: NotifySendEmailArgs, reference: string) {
    const jobId = await this.queue?.send?.(
      this.QUEUE_NAME,
      {
        template,
        emailAddress,
        options,
      },
      this.queueOptions
    );
    if (!jobId) {
      throw new ApplicationError("NOTIFY", "QUEUE_ERROR", 500, `Sending ${template} to ${emailAddress} failed`);
    }
    this.logger.info({ reference, emailAddress, jobId }, `reference ${reference}, notify email queued with jobId ${jobId}`);
    return jobId;
  }

  async sendEmailToPost(answers: AnswersHashMap, reference: string) {
    const country = answers["country"] as string;
    const post = answers["post"] as string;
    const emailAddress = getPostEmailAddress(country, post);
    const personalisation = PersonalisationBuilder.postNotification(answers, reference);
    if (!emailAddress) {
      this.logger.warn(`No email address found for country ${country} - post ${post}. Post notification will not be sent`);
      return;
    }

    const jobId = await this.queue?.send?.(
      this.QUEUE_NAME,
      {
        template: this.templates.postNotification,
        emailAddress,
        options: {
          reference,
          personalisation,
        },
      },
      this.queueOptions
    );

    if (!jobId) {
      throw new ApplicationError("NOTIFY", "QUEUE_ERROR", 500, `Sending ${this.templates.postNotification} to ${emailAddress} failed`);
    }

    return jobId;
  }
}
