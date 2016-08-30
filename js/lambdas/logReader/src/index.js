'use strict';
var AWS = require('aws-sdk')
var https = require('https');

exports.handler = (event, context, callback) => {
    var cloudWatchLogs = new AWS.CloudWatchLogs({
        apiVersion: '2014-03-28'
    });
    /*
    var paramsGLE = {
        logGroupName: '/aws/lambda/logger',
        logStreamName: '2016/06/03/[$LATEST]c46aef75d8cf49b6ab105abf24abf637',
        limit: 0,
        nextToken: 'STRING_VALUE',
        startFromHead: true,
        startTime: 0,
        endTime: 0
    };
    
    cloudWatchLogs.getLogEvents(paramsGLE, function(err, data) {
        if (err) {
            console.log('error')
        } else {
            console.log(data)
            context.done(null, 'Ok')
        }
    })
    */
    
    /*
    var paramsDLS = {
        logGroupName: '/aws/lambda/logger',
        descending: true,
        limit: 1,
        orderBy: 'LastEventTime' //'LogStreamName | LastEventTime'
        //logStreamNamePrefix: 'STRING_VALUE',
        //nextToken: 'STRING_VALUE',
    };
    
    cloudWatchLogs.describeLogStreams(paramsDLS, function(err, data) {
        if (err) {
            console.log('error')
        } else {
            console.log(data)
            context.done(null, 'Ok')
        }
    })
    */
    
    var i = parseInt(event.i);
    var url = 'https://oz356ym5ai.execute-api.us-west-2.amazonaws.com/beta/tests/logger?i=' + (i + 1);
    
    console.log('Logger log event: ' + i);   
    
    if (i < 20) {
        https.get(url, function(rsp) {
            console.log('Done.');
            context.done(null, 'Successful request.');
        }).on('error', function(e) {
            context.done("error: " + e.message);
        });    
    }
};
