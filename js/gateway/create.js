var AWS = require('aws-sdk');
var fs = require('fs');
var parms = [];
var pIndex = 0;
var cfg = {};

AWS.config.loadFromPath('../../aws.config.json');

var apigateway = new AWS.APIGateway({ apiVersion: '2015-07-09' });
var params;
var step = 7;

/*
    Step 1: create API
*/
params = {
  name: 'sample', 
  //cloneFrom: 'STRING_VALUE',
  description: 'This is a sample REST API.'
};

if (step == 1) {
  apigateway.createRestApi(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log(data);
    }
  });  
}

/*
    Step 2: Get resource info for new API to parentId for root path
*/
params = {
  restApiId: 'wh8ldi9fdj'
}

if (step == 2) {
  apigateway.getResources(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log(data);
    }
  });  
}

/*
    Step 3: Create resource
*/
params = {
  parentId: '8nhvstm0u9',
  pathPart: 'fn',
  restApiId: 'wh8ldi9fdj'
}

if (step == 3) {
  apigateway.createResource(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log(data);
    }
  });  
}

/*
    Step 4: Put method
*/
params = {
  authorizationType: 'NONE',
  apiKeyRequired: false,
  httpMethod: 'GET',
  requestParameters: { 
    'method.request.querystring.i': false
  },
  resourceId: 'qv22l3',
  restApiId: 'wh8ldi9fdj'
}

if (step == 4) {
  apigateway.putMethod(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log(data);
    }
  });  
}

/*
    Step 5: Get method
*/
params = {
  httpMethod: 'GET',
  resourceId: 'qv22l3',
  restApiId: 'wh8ldi9fdj'
}

if (step == 5) {
  apigateway.getMethod(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log(data);
    }
  });  
}

/*
    Step 6: Put integration
*/
var region = 'us-west-2';
var prefix = 'arn:aws:apigateway:' + region + ':lambda:path/2015-03-31/functions/';

params = {
  credentials: 'arn:aws:iam::124672303740:role/apiGateway',
  httpMethod: 'GET',
  integrationHttpMethod: 'POST',
  resourceId: 'qv22l3',
  restApiId: 'wh8ldi9fdj',
  type: 'AWS',
  uri: prefix + 'arn:aws:lambda:us-west-2:124672303740:function:test',
  requestParameters: {
    'integration.request.header.X-Amz-Invocation-Type': "'Event'",
    'integration.request.querystring.i': 'method.request.querystring.i'
  },
  requestTemplates: {
    'application/json': '{"i":"$input.params(\'i\')"}'
  }
}

if (step == 6) {
  apigateway.putIntegration(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log(data);
    }
  });  
}

/*
    Step 7: Put integration
*/
params = {
  httpMethod: 'GET',
  resourceId: 'qv22l3',
  restApiId: 'wh8ldi9fdj',
  statusCode: '200'
}

if (step == 7) {
  apigateway.putIntegrationResponse(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log(data);
    }
  });  
}

/*
    Step 8: Put integration
*/
params = {
  httpMethod: 'GET',
  resourceId: 'qv22l3',
  restApiId: 'wh8ldi9fdj',
  statusCode: '200'
}

if (step == 8) {
  apigateway.putMethodResponse(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log(data);
    }
  });  
}


/*
    Step 9: Test
*/
params = {
  httpMethod: 'GET',
  resourceId: 'qv22l3',
  restApiId: 'wh8ldi9fdj',
  body: ''
}

if (step == 9) {
  apigateway.testInvokeMethod(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log(data);
    }
  });  
}