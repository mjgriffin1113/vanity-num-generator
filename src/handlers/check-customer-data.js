/**
 * @description - this lambda gets the caller's phone number and checks
 *                the DB for any existing data for that number
 */

// IMPORTS
var AWS = require('aws-sdk');
var docClient = new AWS.DynamoDB.DocumentClient();

// LITERALS
const NUMBER_OPTIONS = 'numberOptions';
const HAS_CUSTOMER_DATA_FLAG = 'hasCustomerDataFlag';

/**
 * 
 * @param {*} data 
 */
function getMostRecentResponse (data) {
    data.sort((a,b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
    return data[0]
}

/**
 * 
 * @param {object} data - DynamoDB Item returned from the vanity_numbers table
 * @returns {object} - flattens the object so it has only one level of properties
 *                     (nested objects are not supported in Connect Contact Flows)
 */
function simplifyDataResponse (data) {
    // flatten it
    const simplifiedObject = {};
    const keys = Object.keys(data);

    for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        const valueObj = data[key];
        if (key === NUMBER_OPTIONS) {
            for (let y = 0; y < valueObj.length; y += 1) {
                const optionKey = `option${y+1}`;
                simplifiedObject[optionKey] = valueObj[y];
            }
        } else {
            simplifiedObject[key] = valueObj;
        }
    }

    // add hasCustomerDataFlag for contact flow check
    if (keys.length > 0) simplifiedObject[HAS_CUSTOMER_DATA_FLAG] = true;
    
    return simplifiedObject
}

/**
 * 
 * @param {string} customerPhone - number to lookup data for
 * @param {Function} callback - lambda callback function
 */
function getCustomerData (customerPhone, callback) {
    
    const params = {
        TableName: process.env.TABLE_NAME,
        KeyConditionExpression: "#customerPhone = :customerPhone",
        ExpressionAttributeNames: {
            "#customerPhone": "customerPhone"
        },
        ExpressionAttributeValues: {
            ":customerPhone": customerPhone
        }
    };

    docClient.query(params, function(err, data) {
        if (err) {
            callback(err);
        } else {
            // amazon connect needs the return object to be a single level object with simple types
            try {
                console.log(data);
                const mostRecentItem = getMostRecentResponse(data.Items);
                const simplified = simplifyDataResponse(mostRecentItem || {})
                callback(null, simplified);
            } catch (err) {
                callback(new Error('error simplifying the response from dynamo db: ' + err));
            }
        }
    });
    
}

exports.getCustomerDataHandler = function(event, context, callback) {
	const customerPhone = event.Details.ContactData.CustomerEndpoint.Address;
    
    if (!customerPhone) callback(new Error('could not find customer phone in event details'));
    
	getCustomerData(customerPhone, callback);
}