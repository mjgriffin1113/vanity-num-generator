// IMPORTS
const lambda = require('../../../src/handlers/get-call-history');
const event = require('../../../events/AmazonConnectEvent.json');
const { expectedVanityNumber } = require('../util/constants');

// TESTS
const getCallHistoryTest = () => {    
    // This test invokes the hello-from-lambda Lambda function and compares the result
    it('test the get call history lambda handler', async (done) => {
        const callbackFn = (err, data) => {
            if (err) done(err);
            try {
                const callHistory = JSON.parse(data.body);
                expect(callHistory[0].vanityNumber).toBe(expectedVanityNumber);
                done();
            } catch (error) {
                done(error);
            }
        };

        lambda.getCallHistoryHandler(null, null, callbackFn);
    });
};

module.exports = getCallHistoryTest;