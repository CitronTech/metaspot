var AWS = require('aws-sdk');
var fs = require('fs');
var parms = [];
var pIndex = 0;
var cfg = {}

AWS.config.loadFromPath('../../aws.config.json');

var apigateway = new AWS.APIGateway({ apiVersion: '2015-07-09' });

apigateway.getRestApis({}, function (err, data) {
  if (err) {
    console.log(err, err.stack);
  } else {
    console.log(data);
    console.log('\n----------------------------------------------------\n');
    
    cfg.restApiId = data.items[1].id
    
    parms.push({
      restApiId: cfg.restApiId
    });
    
    apigateway.getResources(parms[pIndex], function(err, data) {
      if (err) {
        console.log(err, err.stack);
      } else {
        console.log(data);
        console.log('\n----------------------------------------------------\n');
        
        cfg.resourceId = data.items[2].id;
        
        pIndex++;
        
        parms.push({
          resourceId: cfg.resourceId,
          restApiId: cfg.restApiId 
        });
        
        apigateway.getResource(parms[pIndex], function(err, data) {
          if (err) {
            console.log(err, err.stack);
          } else {
            console.log(data);
            console.log('\n----------------------------------------------------\n');
            
            cfg.method = 'GET';
            
            pIndex++;
            
            parms.push({
              httpMethod: cfg.method,
              resourceId: cfg.resourceId,
              restApiId: cfg.restApiId
            });
            
            apigateway.getMethod(parms[pIndex], function(err, data) {
              if (err) {
                console.log(err, err.stack);
              } else {
                var mrsp200 = data.methodResponses['200'];
                console.log(mrsp200.responseParameters);
                console.log('\n----------------------------------------------------\n');
              }
            });
          }
        });
      }
    });
  }
});
