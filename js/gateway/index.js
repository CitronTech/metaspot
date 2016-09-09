var AWS = require('aws-sdk');
var fs = require('fs');
var parms = [];
var pIndex = 0;
var cfg = {};

AWS.config.loadFromPath('../../aws.config.json');

var apigateway = new AWS.APIGateway({ apiVersion: '2015-07-09' });

if (process.argv[2] == 'create') {
  // parms.push({
  //   restApiId: 'oz356ym5ai',
  //   parentId: 'tw8h162wdk',
  //   pathPart: 'getAlbumDetails'
  // });
  
  // apigateway.createResource(parms[0], function(err, data) {
  //   if (err) {
  //     console.log(err, err.stack);
  //   } else {
  //     console.log(data);
  //   }
  // });
  
  parms.push({
    authorizationType: 'NONE',
    httpMethod: 'GET',
    resourceId: 'rrrw1z',
    restApiId: 'oz356ym5ai',
    requestParameters: {
      'method.request.querystring.year': true,
      'method.request.querystring.index': true
    }
  });
  
  apigateway.putMethod(parms[0], function(err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log(data);
    }
  });
}

if (process.argv[2] == 'inspect') {
  apigateway.getRestApis({}, function (err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log('[Get Rest APIs]\n');
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
          console.log('[Get Resources]\n');
          console.log(data);
          console.log('\n----------------------------------------------------\n');
          
          cfg.resourceId = data.items[3].id;
          
          pIndex++;
          
          parms.push({
            resourceId: cfg.resourceId,
            restApiId: cfg.restApiId 
          });
          
          apigateway.getResource(parms[pIndex], function(err, data) {
            if (err) {
              console.log(err, err.stack);
            } else {
              console.log('[Get Resource]\n');
              console.log(data);
              console.log('\n----------------------------------------------------\n');
              
              cfg.method = 'GET';
              
              pIndex++;
              
              parms.push({
                httpMethod: cfg.method,
                resourceId: cfg.resourceId,
                restApiId: cfg.restApiId
              });
            
            apigateway.getIntegration(parms[pIndex], function(err, data) {
              if (err) {
                console.log(err, err.stack);
              } else {
                console.log('[Get Integration]\n');
                //var mrsp200 = data.methodResponses['200'];
                //console.log(mrsp200.responseParameters);
                console.log(data);
                console.log('\n----------------------------------------------------\n');
              }
            });
          }
        });
      }
    });
  }
});  
}

