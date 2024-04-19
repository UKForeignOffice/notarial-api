# notarial-worker

Handles emails via GOV.UK Notify or AWS SES.

The queues are managed by [pg-boss](https://github.com/timgit/pg-boss)

The current naming scheme is `NOTIFY_*` and `SES_*` to handle GOV.UK Notify and AWS SES respectively.
The suffixes `_PROCESS` and `_SEND` are currently used.

- `_PROCESS` is used to store the parameters, and allow retrying of the message. Minimal business logic is used for these workers,
  they simply send the request to `notarial-api/forms/emails*` where the actual parsing of data and business logic is held
- `_SEND` is used to send the email

The general flow is

1. POST to /forms (handled by forms-worker)
1. creates two messages (`.sendToProcessQueue`) which just takes the data and adds it to `*_PROCESS` queues
1. On successful message creation, respond with success (so POST to /forms doesn’t need to be retried)
1. Worker picks up the (`sendToProcessQueue`) messages and POSTs to /forms/emails/ses and /forms/emails/notify
1. Endpoints parse the data and throw appropriately
1. On success, sticks the compiled notify/ email body on the `*_SEND` queues
1. Worker sends the emails

This allows all stages to be retried individually. If errors are thrown, or there are erroneous responses (4xx or 5xx errors),
these will be stored in the database, in the output column.

A simplified diagram of this flow can be found in [simplified_flow.svg](./docs/assets/simplified_flow.svg).


- `NOTIFY_PROCESS` is handled by [notifyProcessHandler](queues/notify/workers/notifyProcessHandler.ts)
- `NOTIFY_SEND` is handled by [notifySendHandler](queues/notify/workers/notifySendHandler.ts)
- `SES_PROCESS` is handled by [sesProcessHandler](queues/ses/workers/sesProcessHandler.ts)
- `SES_SEND` is handled by [sesSendHandler](queues/ses/workers/sesSendHandler.ts)

Generally all jobs will be added to the queue with the data required for the operation, as well as metadata to allow for easy tracking of the job.
All jobs will have a metadata property, which will contain the reference number. This will match with their GOV.UK Pay reference number (not to be confused wit their payment ID).


## `notifyProcessHandler`

[notifyProcessHandler](queues/notify/workers/notifyProcessHandler.ts)

When a message on the `NOTIFY_PROCESS` queue is detected this worker will send a request to `notarial-api/forms/emails/notify`.
The source of this event is notarial-api, after a user has submitted a form (POST /forms) [SubmitService.submitForm](../../api/src/middlewares/services/SubmitService/SubmitService.ts)

```postgresql
    select * from pgboss.job where name = 'NOTIFY_PROCESS';
```

The data stored in this job will be the user's answers, and the metadata of the form submission. For example:

```json5
{ 
  "answers": {
    "firstName": "test",
    "middleName": null, 
    "dateOfBirth": "2000-01-01"
    /** etc **/
  },
  "metadata": {
    "type": "affirmation", 
    "payment": { 
      "payId": "usfetplth9aqfm0ft598eigpkm",
      "state": { 
        "status": "created",
        "finished": false
      },
      "reference": "B-6FYZIU1M"
    },
    "reference": "B-6FYZIU1M"
  }
}
```


## `notifySendHandler`

[notifySendHandler](queues/notify/workers/notifySendHandler.ts)

When a message on the "NOTIFY_SEND" queue is detected, this worker sends a GOV.UK notify request.
The source of this event is notarial-api/forms/emails/notify, which processes the user's data.

```postgresql
    select * from pgboss.job where name = 'NOTIFY_SEND';
```

The data stored in this job will be GOV.UK Notify API options, which include personalisations, reference, template ID and email address. 

For example:
```json5
 {
  "options": {
    "reference": "PF3N8EGP9L",
    "personalisation": {
      "post": "British Embassy Rome",
      "country": "Italy",
      "firstName": "test",
      /** etc **/
    },
    "metadata": {
      "reference": "PF3N8EGP9L"
    }, 
    "template": "ABC-DEF",
    "emailAddress": "pye@cautionyourblast.com"
  }
}
```

## `sesProcessHandler`

[sesProcessHandler](./queues/ses/workers/sesProcessHandler.ts)

When a message on the `SES_PROCESS` queue is detected this worker will send a request to `notarial-api/forms/emails/ses`.
The source of this event is notarial-api, after a user has submitted a form (POST /forms) [SubmitService.submitForm](../../api/src/middlewares/services/SubmitService/SubmitService.ts)

```postgresql
    select * from pgboss.job where name = 'SES_PROCESS';
```

## `sesSendHandler`

[sesSendHandler](./queues/ses/workers/sesSendHandler.ts)

When a message on the "NOTIFY_SEND" queue is detected, this worker sends a GOV.UK notify request.
The source of this event is notarial-api/forms/emails/ses, which processes the user's data.

```postgresql
    select * from pgboss.job where name = 'SES_SEND';
```

The data stored in this job will be the email body and attachments.

```json5
{
  "body": "\n<p>Dear British Embassy Rome, Use them to create a new case in Casebook and prepare the affirmation document.\n</p>...",
  "subject": "cni application, British Embassy Rome – PF3N8EGP9L",
  "metadata": {
    "reference": "PF3N8EGP9L"
  },
  "reference": "PF3N8EGP9L",
  "onComplete": {
    "job": {
      "options": { // This will match the NOTIFY_SEND job
        "personalisation": {},
        "template": "ABCDEF_EG",
        "reference": "PF3N8EGP9L",
        "emailAddress": "pye@cautionyourblast.com"
      },
      "queue": "NOTIFY_SEND"
    },
    "attachments": [
      {
        "key": "ukPassportFile",
        "type": "file",
        "title": "UK passport",
        "answer": "http://documentupload:9000/v1/files/511ffde6-ea44-4d72-967c-a5581f73fb8e.png",
        "category": "applicantDetails"
      }
    ]
  }
}
```
The attachments will be fetched, then added to the email body in memory (i.e. not updated in the database) before sending to SES.


### Troubleshooting

When tasks fail, the error emitted will automatically be added to the jobs, and the error is logged. If the logs are incomplete, further logging may be found on the database in the `output` column.

See [TROUBLESHOOTING.md](./../TROUBLESHOOTING.md) for more information.


### Environment variables

| Env var                                | Description                                                                                             | default                                      |
|----------------------------------------|---------------------------------------------------------------------------------------------------------|----------------------------------------------|
| `QUEUE_URL`                            | Connection string of the db                                                                             | postgres://user:root@localhost:5432/notarial |
| `ARCHIVE_FAILED_AFTER_DAYS`            | In days, how long to keep failed jobs in the table `pgboss.jobs`, before sending it to `pgboss.archive` | 30                                           |
| `DELETE_ARCHIVED_AFTER_DAYS`           | In days, how long to keep any jobs in `pgboss.archive` before deleting                                  | 7                                            |
| `MONITOR_STATE_INTERVAL_SECONDS`       | In seconds, how often to log the statuses of each queue                                                 | 10                                           |
| `NOTIFY_API_KEY`                       | Notify API key to send emails from                                                                      |                                              |
| `SES_SENDER_NAME`                      | The name to display when sending an email via SES                                                       | Getting Married Abroad Service               |
| `SENDER_EMAIL_ADDRESS`                 | Where the email should be sent from. There must be an SES domain identity matching this email address   | pye@cautionyourblast.com                     |
| `SUBMISSION_ADDRESS`                   | Where to send the emails to                                                                             | pye@cautionyourblast.com                     |
| `NOTARIAL_API_CREATE_SES_EMAIL_URL`    | URL on the notarial-api where SES emails can be created                                                 | http://localhost:9000/forms/emails/ses       |
| `NOTARIAL_API_CREATE_NOTIFY_EMAIL_URL` | URL on the notarial-api where Notify emails can be created                                              | http://localhost:9000/forms/emails/notify    |
| `FILES_ALLOWED_ORIGINS`                | Allowed origins where files can be downloaded from                                                      | ["http://localhost:9000"]                    |

