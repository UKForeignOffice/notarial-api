module.exports = {
  Queue: {
    url: "postgres://user:root@localhost:5432/queue",
    archiveFailedInDays: 30,
    deleteArchivedAfterDays: 7,
  },
  Notify: {
    Retry: {
      backoff: "true",
      limit: "50",
    },
  },
  SES: {
    Sender: {
      name: "Getting Married Abroad Service",
      emailAddress: "pye@cautionyourblast.com",
    },
    Recipient: {
      emailAddress: "pye@cautionyourblast.com",
    },
    Retry: {
      backoff: "true",
      limit: "50",
    },
  },
};
