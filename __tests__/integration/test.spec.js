const generateVanityNumberTests = require('./handlers/generate-vanity-number-test');
const insertVanityNumberTests = require('./handlers/insert-vanity-number-test');
const checkCustomerDataTests  = require('./handlers/check-customer-data-test');
const getCallHistoryTests = require('./handlers/get-call-history-test');

// quick/hacky way to load the environment variables for testing
const dotenv = require('dotenv');
dotenv.config();

// End to end testing
// Need to run `aws configure` before running the tests
describe('generate vanity number lambda tests', generateVanityNumberTests);
describe('insert vanity number lambda tests', insertVanityNumberTests);
describe('check customer data lambda tests', checkCustomerDataTests);
describe('get call history lambda tests', getCallHistoryTests);
