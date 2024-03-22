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

- `NOTIFY_PROCESS` is handled by [notifyProcessHandler](queues/notify/workers/notifyProcessHandler.ts)
- `NOTIFY_SEND` is handled by [notifySendHandler](queues/notify/workers/notifySendHandler.ts)
- `SES_PROCESS` is handled by [sesProcessHandler](queues/ses/workers/sesProcessHandler.ts)
- `SES_SEND` is handled by [sesSendHandler](queues/ses/workers/sesSendHandler.ts)

## `notifyProcessHandler`

[notifyProcessHandler](queues/notify/workers/notifyProcessHandler.ts)

When a message on the `NOTIFY_PROCESS` queue is detected this worker will send a request to `notarial-api/forms/emails/notify`.
The source of this event is notarial-api, after a user has submitted a form (POST /forms) [SubmitService.submitForm](../../api/src/middlewares/services/SubmitService/SubmitService.ts)

```postgresql
    select * from pgboss.job where name = 'NOTIFY_PROCESS';
```

## `notifySendHandler`

[notifySendHandler](queues/notify/workers/notifySendHandler.ts)

When a message on the "NOTIFY_SEND" queue is detected, this worker sends a GOV.UK notify request.
The source of this event is notarial-api/forms/emails/notify, which processes the user's data.

```postgresql
    select * from pgboss.job where name = 'NOTIFY_SEND';
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

### Troubleshooting

When tasks fail, the error emitted will automatically be added to the jobs, and the error is logged.

If the logs are incomplete, further logging may be found on the database in the `output` column.

To see all failed events

```postgresql

select * from pgboss.job where name = 'notify' and state = 'failed';

```

```postgresql
    select data, output from pgboss.job where id = '6aa3b250-4bc8-4fcb-9a15-7ca56551d04b';
```

Events can easily be retried by setting completedon = null, retrycount = 0, state = 'created'

```postgresql
    update pgboss.job
    set data = jsonb_set(
            data,
            '{webhook_url}',
            '"https://b4bf0fcd-1dd3-4650-92fe-d1f83885a447.mock.pstmn.io"'
        ),
    completedon = null,
    retrycount = 0,
    state = 'created'
    where id = '4aad27dc-db53-48e4-824b-612a4b3d9fa7';
```

If you cannot find a job in `pgboss.job`, it may be in the archive table, `pgboss.archive`.

```postgresql
    select * from pgboss.archive where id = '4aad27dc-db53-48e4-824b-612a4b3d9fa7;'
```

If you wish to keep a record of the failed event, create a new event using the failed events details.

```postgresql
    insert into pgboss.job (name, data)
    SELECT name, data
    from pgboss.job where id = '4aad27dc-db53-48e4-824b-612a4b3d9fa7';
```

### Environment variables

| Env var                                | Description                                                                                             | default                                   |
|----------------------------------------|---------------------------------------------------------------------------------------------------------|-------------------------------------------|
| `QUEUE_URL`                            | Connection string of the db                                                                             | postgres://user:root@localhost:5432/queue |
| `ARCHIVE_FAILED_AFTER_DAYS`            | In days, how long to keep failed jobs in the table `pgboss.jobs`, before sending it to `pgboss.archive` | 30                                        |
| `DELETE_ARCHIVED_AFTER_DAYS`           | In days, how long to keep any jobs in `pgboss.archive` before deleting                                  | 7                                         |
| `NOTIFY_API_KEY`                       | Notify API key to send emails from                                                                      |                                           |
| `SES_SENDER_NAME`                      | The name to display when sending an email via SES                                                       | Getting Married Abroad Service            |
| `SENDER_EMAIL_ADDRESS`                 | Where the email should be sent from. There must be an SES domain identity matching this email address   | pye@cautionyourblast.com                  |
| `SUBMISSION_ADDRESS`                   | Where to send the emails to                                                                             | pye@cautionyourblast.com                  |
| `NOTARIAL_API_CREATE_SES_EMAIL_URL`    | URL on the notarial-api where SES emails can be created                                                 | http://localhost:9000/forms/emails/ses    |
| `NOTARIAL_API_CREATE_NOTIFY_EMAIL_URL` | URL on the notarial-api where Notify emails can be created                                              | http://localhost:9000/forms/emails/notify |
| `FILES_ALLOWED_ORIGINS`                | Allowed origins where files can be downloaded from                                                      | ["http://localhost:9000"]                 |
