/**
 * @description - this lambda takes the parameters (vanity number data to be stored)
 *                and writes it to the db
 */

// IMPORTS
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

// FUNCTIONS
/**
 * 
 * @param {object} data - data to be validated
 * @returns {boolean} true if customerPhone and vanityNumber are present
 */
function validateParams (data) {
    return !!data.customerPhone && !!data.vanityNumber
}

/**
 * 
 * @param {object} data - data to be inserted
 * @param {Function} callback - AWS Lambda callback function
 */
function insertVanityNumber (data, callback) {
    
    const params = {
        TableName: process.env.TABLE_NAME,
        Item: {
            'customerPhone': data.customerPhone,
            'lastUpdated': new Date(Date.now()).toISOString(),
            'numberOptions': [data.option1, data.option2, data.option3, data.option4, data.option5],
            'vanityNumber': data.vanityNumber,
        }
    };

    docClient.put(params, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
}

// HANDLER
exports.insertNumberHandler = function(event, context, callback) {
    try {
        const data = event.Details.Parameters;
        // validate and insert the data
        if (validateParams(data))
            insertVanityNumber(data, callback);
        else
            callback(new Error('invalid params for data insert'));
    } catch (e) {
        callback('error inserting the vanity number data: ' + e.message);
    }
}