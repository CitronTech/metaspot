var AWS = require('aws-sdk');
var fs = require('fs');

AWS.config.loadFromPath('../../../config.json');

var lambda = new AWS.Lambda({apiVersion: '2015-03-31'});
var parms, lambdaFn;
var fn = 'scrapeMetaPage';

if (process.argv[2] == '--create') {
  parms = {
    Code: {
      ZipFile: fs.readFileSync('./lambda.zip')
    },
    FunctionName: fn,
    Handler: 'index.handler',
    Role: 'arn:aws:iam::124672303740:role/lambda_dynamo',
    //Role: 'arn:aws:iam::124672303740:role/lambda_basic_execution',
    Runtime: 'nodejs4.3',
    Description: '',
    MemorySize: 128,
    Publish: false,
    Timeout: 30
  };  
  
  lambdaFn = 'createFunction';
} else {
  parms = {
    FunctionName: fn,
    ZipFile: fs.readFileSync('./lambda.zip')
  }
  
  lambdaFn = 'updateFunctionCode';
}

lambda[lambdaFn](parms, function(err, data) {
  if (err) {
    console.log(err, err.stack);
  } else {
    console.log(data);
  }
})
