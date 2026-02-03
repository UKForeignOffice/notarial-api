# notarial-api
This ia a monorepo used for the notarial services apis, which power the [prove your eligibility to a foreign government forms](https://github.com/UKForeignOffice/prove-eligibility-foreign-government-forms).

## Prerequisites
1. A node version manager, like [nvm](https://formulae.brew.sh/formula/nvm), or [n](https://github.com/tj/n)
2. node 22.x.x
3. yarn >= v1.22. This project uses yarn 3. Yarn v1.22 will load the correct version of yarn by looking at [.yarnrc](./.yarnrc.yml) and [.yarn](./yarn)
4. Docker >= 3.9 - [Install docker engine](https://docs.docker.com/engine/install/)


## Workspaces

* [api](./api/README.md)
* [worker](./worker/README.md)

### Getting started with Docker
You may use docker and docker compose to build and start the project with the right components (e.g. database, microservices), but will not be able to run the application(s) in dev mode.

To do this, simply run this command from the root of the project:
```
docker compose up -d
```

This will then run the server in a docker container in detached mode, allowing you to continue making commands through your terminal, but still keep the docker container running.

To rebuild the server after making some changes, run the following commands:

```
docker compose down
docker compose -d --build
```

### Running the applications locally (without docker)

You may still need docker to start the databases.

From the root directory,
`docker compose up postgres`

This will start the postgres container running on port 5432; with username `user` and password `root`,
and a database created called `notarial` (`postgres://user:root@localhost:5432/notarial`).
[`init.sql`](init.sql) is also loaded as a volume into the container, and will create a database named `queue`
(`postgres://user:root@localhost:5432/queue`). This is useful if you are going to be running [forms-worker](https://github.com/UKForeignOffice/forms-queue)
at the same time. If you are running postgres from this repo, you do not need to run it in `forms-queue`.


1. If you wish to send emails locally, you will need to authenticate your terminal with AWS. (`formsawsauth prod`)
2. Start the api `yarn api start:local`
3. start the worker `NOTIFY_API_KEY=".." yarn worker start:local`
4. Send a post request to `http://localhost:9000/forms`, use the payload found in `notarial-api/api/src/middlewares/services/UserService/personalisation/__tests__/fixtures/marriageTestData.ts`, or run the form runner locally, with the webhook configured to `http://localhost:9000/forms`. 


### Formatting
This project uses ESLint and Prettier to ensure consistent formatting. It is recommended that you add and turn on the prettier plugin for your IDE, and reformat on save.


## CI/CD
There is a CI/CD pipeline currently set up for deploying new versions of the project to test environments. For more information, please refer to the [CI/CD docs](docs/ci.md)

This project uses [semantic-release](https://github.com/semantic-release/semantic-release). This allows for automatic versioning of the project based on the commit messages when merging.

When merging, prefix the pull request subject with
- `chore:` for changes which should not increment the version number (like documentation changes)
- `fix:` for bug fixes, (increments the patch version)
- `feat:` for new features (increment the minor version)
- `BREAKING:` for major changes (increments the major version)

[Releases](https://github.com/UKForeignOffice/notarial-api/releases) are automatically generated from commit messages. Prefix each commit with one of the above prefixes to include the commit message in the generated message.


## Testing
Currently, there is unit testing and integration testing set up for the api workspace. For more information, refer to the [testing docs](./docs/testing.md).

