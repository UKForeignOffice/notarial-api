# Testing
A mixture of unit and integration testing is used to prove the validity of each workspace. We use jest for unit testing, and cypress for integration and e2e testing.

## Unit testing
Full code coverage for unit testing isn't necessary, however each main functional component that has a process that could go wrong should be tested.

### running unit tests
Unit tests will be run every time a new commit is pushed to any branch, however you can also, and are encouraged to, run the tests locally before pushing up your changes.
To run unit tests across the entire repo, execute the command `yarn test`. This will then delegate the command to each workspace independently, and have each workspace execute its own tests.

## Integration testing
Integration testing should involve testing between certain components of the service, but generally should avoid accessing external APIs. This will let ius test interactions between the components of our system, without having to rely on external systems.

### running integration tests
Integration tests will run on every push to main, however you can also, and are encouraged to, run the tests locally before pushing up your tests.

To run the integration tests in headless mode, you can either run `yarn cypress run` or `yarn smoke-test`. Both of these commands will trigger cypress to run from the cypress directory in headless mode.

If you would like to run the tests through the cypress UI, so you can better see errors as they appear, and test changes as you make them, run `yarn cypress open`.