module.exports = {
  Queue: {
    url: "postgres://user:root@localhost:5432/queue",
    archiveFailedInDays: 30,
    deleteArchivedAfterDays: 7,
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
  },
};
