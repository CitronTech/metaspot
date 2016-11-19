'use strict';

var AWS = require('aws-sdk');
var request = require('request');
var Cheerio = require('cheerio');
var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
  /*
    Get date keys from Metaspot table.
      - YXXXX => date keys array i.e. ['0223', '0301', ...]
      
    Event has the following properties:
      - year
      - index
      - dateKeyIndex
  */
  docClient.get(
    {
      TableName: 'Metaspot',
      Key: {
        parmId: 'Y' + event.year
      }
    }, function(err, data) {
      if (err) {
        console.log(err);
      } else {
        if (data && data.Item && Array.isArray(data.Item.dates)) {
          var releaseDate = parseInt(event.year + '' + data.Item.dates[event.dateKeyIndex]);
          
          docClient.query(
            {
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
                  var url = data.Items[event.index].metaUrl;
                  var name = data.Items[event.index].name;
                  /*
                    Fetch Metacritic album details
                  */
                  request({
                    url: 'http://www.metacritic.com' + url + '/details',
                    headers: {
                      'User-Agent': 'Mozilla/5.0 (iPad; U; CPU OS 3_2_1 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Mobile/7B405'
                    }
                  }, function (err, rsp, body) {
                    var details = {}
                    
                    if (!err && rsp.statusCode == 200) {
                      /*
                        Parse Metacritic response
                      */
                      var $ = Cheerio.load(body);
                      details.genre = $('#main .product_details td').eq(1).html();
                      details.genre = details.genre.replace(/\s+/g, '');
                      
                      console.log('Genre: ' + details.genre);
                      
                      /*
                        Fetch Spotify album info if any
                      */
                      request({
                        url: 'https://api.spotify.com/v1/search?q="' + encodeURIComponent(name) + '"&type=album'
                      }, function(err, rsp, body) {
                        if (!err && rsp.statusCode == 200) {
                          var albumInfo;
                          
                          if (typeof body === 'string') {
                            albumInfo = JSON.parse(body);
                          } else {
                            if (typeof body === 'object') {
                              albumInfo = body;
                            } else {
                              albumInfo = {
                                albums: {
                                  items: []
                                }
                              } 
                            }
                          }
                          
                          albumInfo.albums.items.forEach((a) => {
                            if (a.album_type == 'album') {
                              request({
                                url: a.images[1].url
                              }, function (err, rsp, body) {
                                if (!err && rsp.statusCode == 200) {
                                  details.cover = new Buffer(body).toString('base64');
                                  
                                  request({
                                    url: a.href
                                  }, function(err, rsp, body) {
                                    if (!err && rsp.statusCode == 200) {
                                      var trackInfo = {};
                                      
                                      if (typeof body === 'string') {
                                        trackInfo = JSON.parse(body);
                                      } else {
                                        if (typeof body === 'object') {
                                          trackInfo = body;
                                        }
                                      }
                                      
                                      console.log(trackInfo);
                                      
                                      if (Array.isArray(trackInfo.tracks)) {
                                        trackInfo.tracks.forEach(function(t) {
                                          console.log(t)
                                        });
                                      }
                                    } else {
                                      console.log(rsp.statusCode);
                                    }
                                  });
                                  
                                  // docClient.update({
                                  //   TableName: 'FetchedAlbums',
                                  //   Key: {
                                  //     releaseDate: releaseDate,
                                  //     name: name
                                  //   },
                                  //   UpdateExpression: "SET cover = :cover",
                                  //   ExpressionAttributeValues: { 
                                  //     ':cover': details.cover
                                  //   }
                                  // }, function(err, data) {
                                  //   if (err) {
                                  //     console.log(err);
                                  //   } else {
                                      
                                  //   }
                                  // });
                                } else {
                                  console.log(rsp.statusCode);
                                }
                              });
                            }
                          })
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
            }
          )
        }
      }
    }
  )
}
