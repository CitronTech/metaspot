'use strict';

var AWS = require('aws-sdk')
var utils = require('utils')

var docClient = new AWS.DynamoDB.DocumentClient()

module.exports = function(main, context, callback) {
  var U = new utils(context, callback)
  
  this.get = function (query) {
    docClient.get(query, function(err, data) {
      if (err) {
        U.print('dynamo.get', err, { query })
      } else {
        main.next(data)
      }
    })
  }
  
  this.query = function (query) {
    docClient.query(query, function(err, data) {
      if (err) {
        U.print('dynamo.query', err, { query })
      } else {
        main.next(data)
      }
    })
  }
}
