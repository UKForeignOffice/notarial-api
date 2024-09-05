# ADR 001: Database, API and Worker
## Status
Accepted, implemented

## Decisions

### pg-boss, postgres
We will use [pg-boss](https://www.npmjs.com/package/pg-boss) to handle messages and retries. 
Postgres has already been set up to handle messages in [forms-queue](https://github.com/UKForeignOffice/forms-queue), so the resource can be shared. 
The database can also be used for analytics and reporting if necessary.

Database based queuing has been chosen due to ease of setup/local development, and is a pattern established in casemanagement-api. Postgres specifically has been chosen
for ease of JSON queries.

For notarial-api, pg-boss may be replaced with something like SES (or removed entirely). But is required for forms-queue and eligibility. 
Eligibility/[XGovFormBuilder runner](https://github.com/XGovFormBuilder/digital-form-builder/blob/main/docs/adr/0004-submitter.md) can switch off queueing but may come with risks (i.e. losing data). 
XGovFormBuilder queries the database, so it can return the user's confirmation code to them. 

### API and Worker
Generally the API will be responsible for any business logic. The worker will just send messages to the notarial API (or external services).

If the worker/queueing is to be turned off, the API does not need to be changed significantly. The commands to send to AWS SES, or GOV.UK notify, can just be moved into the API space.


## Consequences
The databases may incur higher costs if not sized correctly. 