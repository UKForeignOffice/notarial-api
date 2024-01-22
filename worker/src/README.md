# Queue: `notification`

Workers
- `notifyHandler`
- `sesHandler`

## `notifyHandler`
[notifyHandler]('./queues/notify/workers/notifyHandler.ts')

When a message on the "notify" queue is detected, this worker sends a GOV.UK notify request.
The source of this event is notarial-api, after a user has submitted a form, and the data has been process by notarial-api.

## `sesHandler`
[sesHandler]('./queues/notify/workers/sesHandler.ts')

When a message on the "ses" queue is detected, this worker sends an SES message.
The source of this event is notarial-api, after a user has submitted a form, and the data has been process by notarial-api.

### Troubleshooting

When tasks fail, the error emitted will automatically be added to the jobs table, and the error is logged.

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

If you wish to keep a record of the failed event, create a new event using the failed events details.
```postgresql
    insert into pgboss.job (name, data)
    SELECT name, data
    from pgboss.job where id = '4aad27dc-db53-48e4-824b-612a4b3d9fa7';
```