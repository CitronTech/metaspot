var AWS = require('aws-sdk')
var fs = require('fs')

AWS.config.loadFromPath('../../../aws.config.json')

var lambda = new AWS.Lambda({apiVersion: '2015-03-31'})
var parms, fn
var FN_NAME = 'getAlbumDetails'

if (process.argv[2] == '--create') {
  parms = {
    Code: {
      ZipFile: fs.readFileSync('./lambda.zip')
    },
    FunctionName: FN_NAME,
    Handler: 'index.handler',
    Role: 'arn:aws:iam::124672303740:role/lambda_dynamo',
    //Role: 'arn:aws:iam::124672303740:role/lambda_basic_execution',
    Runtime: 'nodejs4.3',
    Description: 'Gets album cover, genre and tracks',
    MemorySize: 128,
    Publish: false,
    Timeout: 30
  };  
  
  fn = 'createFunction'
} else {
  parms = {
    FunctionName: FN_NAME,
    ZipFile: fs.readFileSync('./lambda.zip')
  }
  
  fn = 'updateFunctionCode'
}

lambda[fn](parms, function(err, data) {
  if (err) {
    console.log(err, err.stack);
  } else {
    console.log(data);
  }
})
