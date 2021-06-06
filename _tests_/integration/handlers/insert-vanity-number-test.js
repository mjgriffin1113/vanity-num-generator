// IMPORTS
const lambda = require('../../../src/handlers/insert-vanity-number');
const event = require('../../../events/AmazonConnectEvent.json');
const invalidParamsEvent = require('../../../events/AmazonConnectMissingParamsEvent.json');

// TESTS
const insertVanityNumberTest = () => {    
    // This test invokes the hello-from-lambda Lambda function and compares the result
    it('test the insert vanity number lambda handler', async (done) => {
        const callbackFn = (err, data) => {
            if (err) done(err);
            try {
                expect(data).toBeTruthy();
                done();
            } catch (error) {
                done(error);
            }
        };

        lambda.insertNumberHandler(event, null, callbackFn);
    });

    it('test bad input - missing params', async (done) => {
        const callbackFn = (err, data) => {
            try {
                expect(err).toBeTruthy();
                done();
            } catch (error) {
                done(error);
            }
        };

        lambda.insertNumberHandler({}, null, callbackFn);
    });

    it('test bad input - invalid params', async (done) => {
        const callbackFn = (err, data) => {
            try {
                expect(err).toBeTruthy();
                done();
            } catch (error) {
                done(error);
            }
        };

        lambda.insertNumberHandler(invalidParamsEvent, null, callbackFn);
    });
};

module.exports = insertVanityNumberTest;