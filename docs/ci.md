# CI/CD pipelines
This monorepo has a deployment pipeline set up for deploying changes to the hosted test environment for these services. This pipeline uses a circleci project to run the pipeline

## Workflows
There are two workflows used by this repo:
- build-deploy
- smoke-test

### build-deploy
The build-deploy workflow is used to actually build and push each docker image, and to deploy the image to the test environment. There are 3 steps to this process:
- test-api - this runs unit tests in the test-api workspace, to ensure that everything is working as expected before deploying.
- publish-api - this will use the Dockerfile located in the api workspace to build a new image for the api service
- deploy-test - this will take the built image and update the EKS service to use the new image tag

This workflow runs every time a new tag is pushed to the repo.

### smoke-test
The smoke-test workflow runs integration and e2e tests on the workspaces to check that they all work together as expected.

The workflow takes all the integration tests inside the cypress directory, and run them using the deployed test architecture for each workspace.

This workflow runs every time a tag is pushed to the repo.