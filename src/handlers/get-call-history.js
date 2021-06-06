/**
 * @description - scan the dynamo db table and return the 5 most recently updated records
 */

// IMPORTS
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

// FUNCTIONS
/**
 * 
 * @param {Function} callback - lambda callback function
 */
function getCallHistory (callback) {
    // going to scan the db and then filter and sort the results
    // this is a shortcut/hacky
    const params = {
        TableName: process.env.TABLE_NAME
    };

    docClient.scan(params, function(err, data) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            // throw an error if the table is too big to be returned in one chunk
            // this will let us know to refactor this or prune the table
            if (data.Count !== data.ScannedCount) callback(new Error('table too big for reliable results'));
            
            // sort by last updated date and return the 5 most recent items
            const callHistory = data.Items;
            callHistory.sort((a,b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
            
            const mostRecentItems = callHistory.slice(0,5);

            const response = {
                statusCode: 200,
                body: JSON.stringify(mostRecentItems),
                isBase64Encoded: false,
                headers: { 
                    "Access-Control-Allow-Origin": "*" 
                }
            };

            callback(null, response);
        }
    });
}

// HANDLER
exports.getCallHistoryHandler = function(event, context, callback) {
	getCallHistory(callback);
}