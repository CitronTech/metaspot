'use strict';

var AWS = require('aws-sdk')
var utils = require('utils')

var docClient = new AWS.DynamoDB.DocumentClient()

module.exports = function(context, main) {
  var U = new utils(context)
  
  this.get = function (query) {
    docClient.get(query, function(err, data) {
      if (err) {
        U.print('dynamo.get', err, { query })
        context.done()
      } else {
        main.next(data)
      }
    })
  }
  
  this.query = function(query) {
    docClient.query(query, function(err, data) {
      if (err) {
        U.print('dynamo.query', err, query)
        context.done()
      } else {
        main.next(data)
      }
    })
  }
}
