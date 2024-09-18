const dotEnv = require("dotenv");

if (process.env.NODE_ENV !== "test") {
  dotEnv.config({ path: ".env" });
}

module.exports = {
  Queue: {
    url: "postgres://user:root@localhost:5432/notarial",
    archiveFailedInDays: 30,
    deleteArchivedAfterDays: 7,
    monitorStateIntervalSeconds: 10,
    schema: "pgboss",
  },
  SES: {
    Sender: {
      name: "Getting Married Abroad Service",
      emailAddress: "pye@cautionyourblast.com",
    },
    Recipient: {
      emailAddress: "pye@cautionyourblast.com",
    },
  },
  Notify: {
    failureCheckSchedule: "0 9 * * *",
  },
  NotarialApi: {
    createSESEmailUrl: "http://localhost:9000/forms/emails/ses",
    createNotifyEmailUrl: "http://localhost:9000/forms/emails/notify",
  },
  Files: {
    allowedOrigins: ["http://localhost:9000"],
  },
};
