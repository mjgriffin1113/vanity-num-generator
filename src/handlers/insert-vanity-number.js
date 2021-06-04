/**
 * @description - this lambda takes the parameters (vanity number data to be stored)
 *                and writes it to the db
 */

// IMPORTS
var AWS = require('aws-sdk');
var docClient = new AWS.DynamoDB.DocumentClient();

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
    
    var params = {
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

exports.insertNumberHandler = function(event, context, callback) {
    const data = event.Details.Parameters;

    if (!data) callback(new Error('missing input parameters from event details'))
    if (!validateParams(data)) callback(new Error('missing required fields from input parameters'))
	
	insertVanityNumber(data, callback);
}