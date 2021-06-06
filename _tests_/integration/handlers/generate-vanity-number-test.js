// IMPORTS
const lambda = require('../../../src/handlers/generate-vanity-number');
const event = require('../../../events/AmazonConnectEvent.json');

// TESTS
const generateVanityNumberTest = () => {    
    // This test invokes the hello-from-lambda Lambda function and compares the result
    it('test the generate vanity number lambda handler', async (done) => {
        const callbackFn = (err, data) => {
            if (err) done(err);
            try {
                expect(data).toBeTruthy();
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