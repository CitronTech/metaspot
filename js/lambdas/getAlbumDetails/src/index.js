'use strict';

var AWS = require('aws-sdk');
var request = require('request');
var Cheerio = require('cheerio');
var docClient = new AWS.DynamoDB.DocumentClient();
var year = 1999;

exports.handler = (event, context, callback) => {
  var parms = {
    TableName: 'Metaspot',
    Key: {
      parmId: 'Y' + year
    }
  }
  
  docClient.get(parms, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      /*
        Get date keys from Metaspot table.
          - date keys are in MMDD format
          - use date keys to query FetchedAlbums tables
      */
      if (data && data.Item && Array.isArray(data.Item.dates)) {
        /*
          
        */
        var releaseDate = parseInt(year + '' + data.Item.dates[0]);
        
        docClient.query({
          TableName: 'FetchedAlbums',
          KeyConditionExpression: 'releaseDate = :date',
          ExpressionAttributeValues: {
            ':date': releaseDate
          }
        }, function(err, data) {
          if (err) {
            console.log(err);
          } else {
            if (data && Array.isArray(data.Items)) {
              /*
                Iterate through albums
              */
              var url = data.Items[0].metaUrl;
              var name = data.Items[0].name;
              /*
                Fetch Metacritic album details
              */
              request({
                url: 'http://www.metacritic.com' + url + '/details',
                headers: {
                  'User-Agent': 'Mozilla/5.0 (iPad; U; CPU OS 3_2_1 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Mobile/7B405'
                }
              }, function (err, rsp, body) {
                if (!err && rsp.statusCode == 200) {
                  /*
                    Parse Metacritic response
                  */
                  var $ = Cheerio.load(body);
                  var genre = $('#main .product_details td').eq(1).html();
                  genre = genre.replace(/\s+/g, '');
                  
                  console.log('Genre: ' + genre);
                  
                  /*
                    Fetch Spotify album info if any
                  */
                  request({
                    url: 'https://api.spotify.com/v1/search?q="' + encodeURIComponent(name) + '"&type=album'
                  }, function(err, rsp, body) {
                    if (!err && rsp.statusCode == 200) {
                      console.log(body);
                    } else {
                      console.log(rsp.statusCode);
                    }
                  })
                } else {
                  console.log(rsp.statusCode);
                }
              })
            }
          }
        })
      }
    }
  });
}
