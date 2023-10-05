# API workspace
This workspace is used to run the API server, which is called at various parts during the form and triggers email submissions after the form has been submitter.

## Getting started
You can get this repo up and running in two ways; either via `node` and `yarn` directly, or via Docker.

### Getting started with Node and Yarn
You will need node >=18 in order to run the server locally using node.

There are two ways of getting started using node. You can do this from the root of the project, or from the api workspace directly.

To start the server from the root of the project, run the following commands:
```
yarn install
yarn api build
yarn api start:local
```
These commands will build the project dependencies, cmpile the initial build of the api workspace, and run the workspace in local mode (allowing watching for changes).

To start the serevr from the api workspace, run the following commands:
```
yarn install
cd api
yarn build
yarn start:local
```
There is no benefit to starting the server from the api workspace, however may be more intuitive if you are new to the concept of yarn workspaces

### Getting started with Docker
This method requires Docker >= 3.9 to be installed.

If you want to get the server running quickly locally, without the added support of being able to edit and restart teh server on the fly, you can create the server using `Docker` and `docker-compose`.

To do this, simply run this command from the root of the project:
```
docker-compose up -d
```

This will then run the server in a docker container in detached mode, allowing you to continue making commands through your terminal, but still keep the docker container running.

If you want to rebuild the server after making some changes, run the following commands:

```
docker-compose down
docker-compose -d --build
```

This will cause docker to tear down the current container, and force a new build image for the server, allowing you to test your most recent changes.

## Routes
There is currently one route set up, which will be used to test the Optical Character Recognition (OCR) capabilities of the server. This route is:
 * /ocr-email