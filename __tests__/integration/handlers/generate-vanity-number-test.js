// IMPORTS
const lambda = require('../../../src/handlers/generate-vanity-number');
const event = require('../../../events/AmazonConnectEvent.json');
const { expectedCustomerPhone } = require('../util/constants');

// TESTS
const generateVanityNumberTest = () => {    
    // This test invokes the hello-from-lambda Lambda function and compares the result
    it('test the generate vanity number lambda handler', async (done) => {
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

        lambda.generateNumberHandler(event, null, callbackFn);
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

        lambda.generateNumberHandler({}, null, callbackFn);
    });
};

module.exports = generateVanityNumberTest;