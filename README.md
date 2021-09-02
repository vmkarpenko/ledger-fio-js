### Fio 

JS Library for communication with Ledger Hardware Wallets.
This library is compatible with the FIO Ledger Application.

### Tests

Automated tests are provided. There are two types of tests

1. `yarn test-integration`. Tests JS api.
2. `yarn device-self-test`. Runs unnit tests on ledger (development build required).

Note that for these tests it is advisable to install the developer build of the FIO app with _headless_ mode enabled unless you want to verify the UI flows, otherwise you will need a significant amount of time to manually confirm all prompts on the device.

### Documentation

- you can build the docs by running `yarn gen-docs` and then navigate to docs_generated/index.html

