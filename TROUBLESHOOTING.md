# Troubleshooting

Use this guide to troubleshoot issues and resolve errors that may occur when notarial-api or notarial-worker is deployed.

Connect to the database:
```sh
kubectl run -it --rm --env PGPASSWORD='<PASSWORD>' --env PAGER= --image=postgres:16  --restart=Never postgres-client -- psql -h <ENDPOINT_URL> -U master -d notarial
```

Replace PASSWORD with the password for the database, ENDPOINT_URL with the endpoint URL for the database.  

## pgboss

[pgboss](https://github.com/timgit/pg-boss) is used to manage queueing jobs. On application start, pgboss will automatically create necessary tables in the database.

### Jobs table
The jobs table `pgboss.job` is where all the current jobs are stored. Jobs will remain here, until they are completed or failed. Then they will move to `pgboss.archive`

The jobs table has the following columns:

```
    Column    |            Type             | Collation | Nullable |           Default           
--------------+-----------------------------+-----------+----------+-----------------------------
 id           | uuid                        |           | not null | gen_random_uuid()
 name         | text                        |           | not null | 
 priority     | integer                     |           | not null | 0
 data         | jsonb                       |           |          | 
 state        | pgboss.job_state            |           | not null | 'created'::pgboss.job_state
 retrylimit   | integer                     |           | not null | 0
 retrycount   | integer                     |           | not null | 0
 retrydelay   | integer                     |           | not null | 0
 retrybackoff | boolean                     |           | not null | false
 startafter   | timestamp with time zone    |           | not null | now()
 startedon    | timestamp with time zone    |           |          | 
 singletonkey | text                        |           |          | 
 singletonon  | timestamp without time zone |           |          | 
 expirein     | interval                    |           | not null | '00:15:00'::interval
 createdon    | timestamp with time zone    |           | not null | now()
 completedon  | timestamp with time zone    |           |          | 
 keepuntil    | timestamp with time zone    |           | not null | now() + '14 days'::interval
 on_complete  | boolean                     |           | not null | false
 output       | jsonb                       |           |          | 
```

Columns/values to note are
- `name`: the name of the job. It can be one of SES_PROCESS, NOTIFY_PROCESS, SES_SEND, NOTIFY_SEND. More detail can be found in [worker/src/README.md](worker/src/README.md). PgBoss will also create some of its own.
- `state`: the state of the job. Read more about them in [pgboss documentation](https://github.com/timgit/pg-boss/blob/master/docs/readme.md#job-states)
    - `created`: the job has been created
    - `failed`: the job has failed
    - `completed`: the job has been completed (successfully)
    - `active`: the job is currently being processed
- `data`: the data associated with the job. 
- `output`: the output of the job. This will contain the reference number, or the error message if the job has failed
- `keepuntil`: the time until the job will be kept in the table. As long as the state is not `failed`
- `startafter`: the time the job will start processing


## Finding jobs
To find jobs that have failed, run the following query:

```postgresql
    select id, output from pgboss.job where state = 'failed';
```

## Fixing data
If the retrylimit has not been hit (retrylimit > retrycount) and the retrylimit is not 0, the job will be automatically retried.

It is recommended you run every query in a transaction, so that you can abort the changes if they are incorrect.

```sql
    begin;
    -- First run a query to print the current state of the job you are trying to change     
    select data from pgboss.job where id = '<id>';

    update pgboss.job
    set state = 'retry',
    completedon = null,
    retrycount = 0,
    startafter = now()
    where id = '<id>';
    
    -- Run the query again, to see if you've made the correct changes
    select data from pgboss.job where state = 'failed' and id = '<id>';
    
    -- Run the following query to commit the changes
    -- commit; 
    -- Run the following to abort the changes
    -- rollback;
```

The following queries will assume that you are running them in a transaction.

## Incorrect data
If the data is incorrect, you can update the data in the database. All data is stored as jsonb, so you can use [postgresql's jsonb functions](https://www.postgresql.org/docs/current/functions-json.html) to update the data

```sql
    update pgboss.job
    set data = jsonb_set(
            data,
            '{data, keyToChange}',
            '"<NEW_ANSWER>"'
        )
    where id = '<id>';
```

You may find it easier to copy the data to a text editor, make the changes, and then update the data in the database.

```sql
    update pgboss.job
    set data = '<NEW_DATA>'
    where id = '<id>';
```

### Retry a job
If a job has failed, and you want to retry it, you can update the `startafter` column to now, and reset the `retrycount` to 0.

```sql
    update pgboss.job
    set state = 'retry',
    completedon = null,
    retrycount = 0,
    startafter = now()
--  output = null  
    where id = '<id>';
```
You may also want to update output to null, to clear the error message.

## Creating a new job
If the job does not seem to be retrying, or it is easier to just create a new job you need to create a new job, you can do so by running the following query:

```sql
    insert into pgboss.job (name, data)
    values ('NOTIFY_PROCESS', '{"answers": {}, "metadata": {}, "reference": "123456"}');
```

Alternatively, you can copy the data from the failed job, and create a new job with the same data.

```sql
    insert into pgboss.job (name, data)
    SELECT name, data
    from pgboss.job where id = '<id>';
```
Ensure you archive or delete the failed job if you decide to create a new one.

### Moving a job from archive to job
If a job has been moved to the archive, and you want to retry it, you can move it back to the jobs table.

```sql
    insert into pgboss.job (name, data)
    SELECT name, data
    from pgboss.archive where id = '<id>';
```



## logs / errors

### API
The following errors are logged by the API. They may be inserted into the database described above, but some errors are to do with failure to send to the queue.
Below is a summary of the errors that may be logged by the API. Some errors may have steps to remediate.


| Error type | Error code                  | Comment                                                                                                                                     |
|------------|-----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| WEBHOOK    | VALIDATION                  | POST from forms-worker (or forms runner) failed validation.                                                                                 |
| SES        | PROCESS_VALIDATION          | POST to /forms/emails/staff failed validation                                                                                               |
| SES        | MISSING_ANSWER              | Expected answer is missing. Check the queue database first, then the notarial database                                                      |
| SES        | UNKNOWN                     | The error has been identified as relating to SES, but logs must be checked for further details                                              |
| NOTIFY     | PROCESS_VALIDATION          | POST to /forms/emails/user failed validation                                                                                                |
| NOTIFY     | UNKNOWN                     | The error has been identified as relating to NOTIFY (or UserService)                                                                        |
| QUEUE      | SES_PROCESS_ERROR           | Inserting into queue failed                                                                                                                 |
| QUEUE      | NOTIFY_PROCESS_ERROR        | Inserting into queue failed                                                                                                                 |
| GENERIC    | UNKNOWN                     |                                                                                                                                             |
| GENERIC    | RATE_LIMIT                  | Rate limit exceeded. If required, this can be changed by adjusting `RATE_LIMIT` env var                                                     |
| GENERIC    | UNKNOWN_SERVICE_APPLICATION | An email address could not be found for the specified post. This implies that a user should not be able to apply for a service at this post |


For the API, generally you may fix the issues in a few ways
- Update the data in the database and retry the job
- Fix the code, redeploy, and let the job be retried. You may need to reset the retry limits via the database

#### SUBMIT_FORM_ERROR
This is a logged error only, but is not thrown or cause an HTTP error. This error should be rare, and likely down to a database issue.

The error will appear like so

```json
{"level":50,"time":1713362276177,"pid":34641,"service":"Submit","reference":"DG19_IJVV6","err":{"type":"ApplicationError","message":"unable to queue NOTIFY_PROCESS_ERROR","stack":"QUEUE: unable to queue NOTIFY_PROCESS_ERROR","httpStatusCode":500,"code":"NOTIFY_PROCESS_ERROR","isOperational":true,"exposeToClient":true,"name":"QUEUE"},"errorCode":"SUBMIT_FORM_ERROR","msg":"NOTARIAL_API_ERROR User's data did not queue correctly. Responding with reference number since their data is safe."}
```

The user's data failed to queue for further processing steps. 

in the /queue database, find and set the job to the `failed` state, and set the retrylimit and retrycount to 0. This is to prevent the user's data from being archived and deleted.
```sql
    update pgboss.job
    set state = 'failed',
    retrylimit = 0,
    retrycount = 0
    where output->>'reference' = 'DG19_IJVV6';
```

If this is a code based issue, redeploy the API with the fix, and retry the job by updating the entry, or creating a new job with the same data.
```sql
    update pgboss.job
    set state = 'created',
    retrylimit = 50,
    retrycount = 0,
    completedon = null
    where output->>'reference' = 'DG19_IJVV6';
```


#### WEBHOOK | VALIDATION

The forms-worker or forms runner attempted to POST to /forms, but validation failed. Only basic validation is applied, so this error should be rare.

Check the /queue database first. If data can be easily amended, amend it on the /queue database and resend it. More details can be found in the [forms-queue troubleshooting guide](https://github.com/UKForeignOffice/forms-queue/blob/main/TROUBLESHOOTING.md#incorrect-data).

#### SES | PROCESS_VALIDATION
Only basic validation is applied, so this error should be rare. 

Check the /notarial database
```sql

-- get all failed
select * from pgboss.job where name = 'SES_PROCESS' and state = 'failed';

-- get by job id
select * from pgboss.job where id = '<id>';

-- get by reference number (GOV.UK Pay reference number / notify reference number)
select * from pgboss.job where data->>'metadata'->>'reference' = '<reference>';

```

#### SES | MISSING_ANSWER

Expected answer is missing. These are required fields, and embassies/consulates need this information. Work backwards in this case. 
1. Investigate the payload in the notarial database with the name `SES_PROCESS` first to see if that data is present, but has been incorrectly parsed.
1. If the data was not present, check the /queue database

If data was present in the queue database, but not in the notarial database, you will need to manually insert the data into the notarial database.

The form JSON may have changed, meaning the remapper is out of date (or the JSON has been updated in error).
Data can be manually added or changed, so it's compatible with the remapper, or a fix to the code can be made. 

You will need to append a `field` object to the jsonb data column in the notarial database. 

1. Check the logs or entry output for which field is missing. It will appear as `Missing answer for <key>`.
1. Check the value that the remapper is expecting 


```sql
-- To add append a field to the fields array
    update pgboss.job
    set data = jsonb_set(
            data,
            '{fields}',
            data->'fields' || '{
                "key": "jurats",
                "type": "list",
                "answer": "Yes",
                "category": "oath"
            }'
        )
    where id = '<id>';
```
If you need to edit a field, it may be easier to copy the data to a text editor, make the changes, and then update the data in the database.



#### NOTIFY | PROCESS_VALIDATION
Only basic validation is applied, so this error should be rare. The job can be edited manually.



#### QUEUE | SES_PROCESS_ERROR / QUEUE | NOTIFY_PROCESS_ERROR

There is an issue adding data to the database. Investigate RDS. 



### Worker

The following are thrown errors, and may be inserted in the database. They have been parsed as `ApplicationError`s to simplify debugging.

| Error type | Error code         | Comment                                                                                        |
|------------|--------------------|------------------------------------------------------------------------------------------------|
| FILE       | ORIGIN_NOT_ALLOWED | Attempted to fetch a file that is not the document upload API                                  |
| FILE       | NOT_FOUND          | document upload API returned a 404                                                             |
| FILE       | URL_INVALID        | The URL is invalid                                                                             |
| FILE       | UNKNOWN            | An error was identified as relating to file code, but logs must be checked for further details |
| CONSUMER   | START_FAILED       | Connection to database/queue could not be established                                          |

The following are logged errors and related to sending requests. These errors are caught, logged, and rethrown with 
minimal parsing to preserve as much data as possible. 


| Error code                         | Comment                                                                                     |
|------------------------------------|---------------------------------------------------------------------------------------------|
| NOTIFY_PROCESS_REQUEST_ERROR       | Error sending request to notarial-api                                                       |
| NOTIFY_PROCESS_RESPONSE_ERROR      | notarial-api responded with an error                                                        |
| NOTIFY_PROCESS_AGGREGATE_ERROR     | Multiple errors occurred whilst making the request to notarial-api                          |
| NOTIFY_PROCESS_UNKNOWN_ERROR       | An error was identified as relating to GOV.UK Notify                                        |
| NOTIFY_SEND_REQUEST_ERROR          | Error sending request to GOV.UK Notify                                                      |
| NOTIFY_SEND_RESPONSE_ERROR         | GOV.UK Notify responded with an error                                                       |
| NOTIFY_SEND_AGGREGATE_ERROR        | Multiple errors occurred whilst making the request to GOV.UK Notify                         |
| NOTIFY_SEND_UNKNOWN_ERROR          | An error was identified as relating to GOV.UK Notify                                        |
| NOTIFY_FAILURE_CHECK_REQUEST_ERROR | An error occurred while trying to retrieve a list of email send failures from GOV.UK Notify |
| SES_PROCESS_REQUEST_ERROR          | Error sending request to notarial-api                                                       |
| SES_PROCESS_RESPONSE_ERROR         | notarial-api responded with an error                                                        |
| SES_PROCESS_AGGREGATE_ERROR        | Multiple errors occurred whilst making the request to notarial-api                          |
| SES_PROCESS_UNKNOWN_ERROR          | An error was identified as relating to SES                                                  |
| SES_SEND_SES_EXCEPTION             | SES responded with an error                                                                 |
| SES_SEND_ON_COMPLETE               | The completion handler failed with an error                                                 |
