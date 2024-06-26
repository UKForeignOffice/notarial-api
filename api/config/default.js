const dotEnv = require("dotenv");

if (process.env.NODE_ENV !== "test") {
  dotEnv.config({ path: ".env" });
}

module.exports = {
  port: "9000",
  env: "development",
  submissionAddress: "pye@cautionyourblast.com",
  senderEmail: "pye@cautionyourblast.com",
  rateLimit: 1200,
  Queue: {
    url: "postgresql://user:root@localhost:5432/notarial",
    defaultOptions: {
      retryBackoff: "true",
      retryLimit: "50",
    },
    SES_SEND: {
      retryBackoff: "true",
      retryLimit: "50",
      onComplete: "true",
    },
    NOTIFY_SEND: {
      retryBackoff: "true",
      retryLimit: "50",
      onComplete: "false",
    },
    SES_PROCESS: {
      retryBackoff: "true",
      retryLimit: "50",
      onComplete: "false",
    },
    NOTIFY_PROCESS: {
      retryBackoff: "true",
      retryLimit: "50",
      onComplete: "false",
    },
  },
  Notify: {
    Template: {},
  },
  postEmails: {},
};
