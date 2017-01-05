'use strict';

var AWS = require('aws-sdk')

var docClient = new AWS.DynamoDB.DocumentClient()

module.exports = function(main, U) {
  this.run = function(action, query) {
    if (action == 'get' || action == 'query' || action == 'update') {
      docClient[action](query || U.value, function(err, data) {
        if (err) {
          U.print('dynamo.run', err, { action, query })
        } else {
          main.next(data)
        }
      })  
    } else {
      U.print('dynamo.run' + action, 'unknown action', { action, query })
    }
  }
}
