# API workspace
This workspace is used to run the API server, which is called at various parts during the form and triggers email submissions after the form has been submitted.

Use the API to house all the business logic. This will allow the worker to be a simple service that just listens for messages and sends them to an API.
The API should parse user's data, render email templates etc. 

## Prerequisites
1. A node version manager, like [nvm](https://formulae.brew.sh/formula/nvm), or [n](https://github.com/tj/n)
2. node 18.x.x
3. yarn >= v1.22. This project uses yarn 3. Yarn v1.22 will load the correct version of yarn by looking at [.yarnrc](./../.yarnrc.yml) and [.yarn](./../yarn)
4. Docker >= 3.9 - [Install docker engine](https://docs.docker.com/engine/install/) 

## Getting started
You can get this repo up and running in two ways; either via `node` and `yarn` directly, or via Docker.

### Getting started with Node and Yarn
You will need node >=18 in order to run the server locally using node.

To start the server from the root of the project, run the following commands:
```
yarn install
yarn api build
yarn api start:local
```
These commands will build the project dependencies, compile the initial build of the api workspace, and run the workspace in local mode (allowing watching for changes).

### Getting started with Docker
You may use docker and docker compose to build and start the project with the right components (e.g. database, microservices), but will not be able to run the application(s) in dev mode.

To do this, simply run this command from the root of the project:
```
docker compose up -d
```

This will then run the server in a docker container in detached mode, allowing you to continue making commands through your terminal, but still keep the docker container running.

If you want to rebuild the server after making some changes, run the following commands:

```
docker compose down
docker compose -d --build
```

This will cause docker to tear down the current container, and force a new build image for the server, allowing you to test your most recent changes.

## Routes

### POST `/forms`
This route is used to submit a form. It will then create two new jobs, "SES_PROCESS" and "NOTIFY_PROCESS". It will then return with a reference number. 
The reference number is the GOV.UK Pay reference number. If a GOV.UK pay reference number could not be found, it will generate a random one. Use this reference number to track the user across the application.


### POST `/forms/emails/ses`
This route is used to parse user's data and prepare an email that will be sent to FCDO. The request will come from the SES_PROCESS job. 
It will generate an email body to be sent via SES. The attachments are not added to the email body at this point.


### POST `/forms/emails/notify`
This route is used to parse the user's data to generate the confirmation email for the user. The request will come from the NOTIFY_PROCESS job.



### Environment variables

| Env var                                             | Description                                                                                                                                     | default                                      |
|-----------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------|
| `PORT`                                              | Port to start the application on                                                                                                                | 9000                                         |
| `NODE_ENV`                                          | Environment the application is running in. If the environment has a matching [config](./config) file, it will use those as the defaults         | development                                  |
| `NOTIFY_TEMPLATE_AFFIRMATION_USER_CONFIRMATION`     | Notify template which sends a confirmation email to the user for the /affirmation form                                                          | 7                                            |
| `NOTIFY_TEMPLATE_EXCHANGE_USER_CONFIRMATION`        | Notify template which sends a confirmation email to the user for the /exchange-uk-cni form                                                      |                                              |
| `NOTIFY_TEMPLATE_EXCHANGE_USER_POSTAL_CONFIRMATION` | Notify template which sends a confirmation email to the user for the /cni                                                                       |                                              |
| `NOTIFY_TEMPLATE_POST_NOTIFICATION`                 | Notify template which alerts embassies that they have an application                                                                            |                                              |
| `QUEUE_URL`                                         | The connection string to the database, including username and password                                                                          | postgres://user:root@localhost:5432/notarial |
| `ARCHIVE_FAILED_AFTER_DAYS`                         | How long to keep failed jobs in the pgboss.job before moving it to pgboss.archive                                                               | 30                                           |
| `DELETE_ARCHIVED_AFTER_DAYS`                        | How long to keep jobs in pgboss.archive before deleting it                                                                                      | 7                                            |
| `SES_SEND_RETRY_BACKOFF`                            | Whether or not to retry SES_SEND jobs if they failed with exponential backoff (i.e. each retry is delayed longer than the last attempt)         | true                                         |
| `SES_SEND_RETRY_LIMIT`                              | Number of times the SES_SEND job is allowed to be retried                                                                                       | 50                                           |
| `SES_SEND_ON_COMPLETE`                              | If SES_SEND has a completion handler (i.e. a job that should be triggered if this job becomes completed), and should be turned on               | true                                         |
| `SES_PROCESS_RETRY_BACKOFF`                         | Whether or not to retry SES_PROCESS if they failed with exponential backoff (i.e. each retry is delayed longer than the last attempt)           | true                                         |
| `SES_PROCESS_RETRY_LIMIT`                           | Number of times the SES_PROCESS job is allowed to be retried                                                                                    | 50                                           |
| `SES_PROCESS_ON_COMPLETE`                           | If SES_PROCESS has a completion handler (i.e. a job that should be triggered if this job becomes completed), and should be turned on            | true                                         |
| `NOTIFY_SEND_RETRY_BACKOFF`                         | Whether or not to retry NOTIFY_SEND jobs if they failed with exponential backoff (i.e. each retry is delayed longer than the last attempt)      | true                                         |
| `NOTIFY_SEND_RETRY_LIMIT`                           | Number of times the NOTIFY_SEND job is allowed to be retried                                                                                    | 50                                           |
| `NOTIFY_SEND_ON_COMPLETE`                           | If NOTIFY_SENd has a completion handler (i.e. a job that should be triggered if this job becomes completed)                                     | true                                         |
| `NOTIFY_PROCESS_RETRY_BACKOFF`                      | Whether or not to retry NOTIFY_PROCESS jobs if they failed with exponential backoff (i.e. each retry is delayed longer than the last attempt)   | true                                         |
| `NOTIFY_PROCESS_RETRY_LIMIT`                        | Number of times the NOTIFY_PROCESS job is allowed to be retried                                                                                 | 50                                           |
| `NOTIFY_PRCESS_ON_COMPLETE`                         | If the NOTIFY_PROCESS job has a completion handler (i.e. a job that should be triggered if this job becomes completed), and should be turned on | true                                         |


