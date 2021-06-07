// IMPORTS
const lambda = require('../../../src/handlers/check-customer-data.js');
const event = require('../../../events/AmazonConnectEvent.json');
const { expectedCustomerPhone } = require('../util/constants');

// TESTS
const checkCustomerDataTests = () => {    
    // This test invokes the hello-from-lambda Lambda function and compares the result
    it('test the check customer data lambda handler', async (done) => {
        const callbackFn = (err, data) => {
            if (err) done(err);
            try {
                expect(data.vanityNumber).toBeTruthy();
                expect(data.option5).toBeTruthy();
                expect(data.customerPhone).toBe(expectedCustomerPhone);
                done();
            } catch (error) {
                done(error);
            }
        };

        lambda.getCustomerDataHandler(event, null, callbackFn);
    });

    it('test bad input', async (done) => {
        const callbackFn = (err, data) => {
            try {
                expect(err).toBeTruthy();
                done();
            } catch (error) {
                done(error);
            }
        };

        lambda.getCustomerDataHandler({}, null, callbackFn);
    });
};

module.exports = checkCustomerDataTests;