var AWS = require('aws-sdk');
var request = require('request');
var Cheerio = require('cheerio');

'use strict';

var docClient = new AWS.DynamoDB.DocumentClient();

var start = 0;
var page = 69;

function yql() {
  var url = {
      yql: "https://query.yahooapis.com/v1/public/yql?",
      query: "q=select%20*%20from%20html%20where%20url%3D%22",
      src: "http%3A%2F%2Fwww.metacritic.com%2Fbrowse%2Falbums%2Frelease-date%2Favailable%2Fdate%3F",
      page: 'page=' + page,
      xpath: "%22%20and%20xpath%3D%22%2F%2Fli%5Bcontains(%40class%2C'product')%20and%20contains(%40class%2C'release_product')%5D%22",
      diagnostics: "&diagnostics=true",
      json: "&format=json"
  }
  
  https.get(url.yql + url.query + url.src + url.page + url.xpath + url.json, function(rsp) {
      if (rsp.statusCode == 200) {
          var body = [];
          var data;
          var albums = [];
          
          rsp.on('data', function(chunk) {
              body.push(chunk);
          }).on('end', function() {
              body = Buffer.concat(body).toString();
              
              try {
                  data = JSON.parse(body);
                  
                  if (data.query && typeof data.query === 'object' && data.query.results && typeof data.query.results === 'object' && Array.isArray(data.query.results.li)) {
                      data.query.results.li.forEach(function(item, i) {
                          if (item.div && Array.isArray(item.div.div)) {
                              var details = item.div.div;
                              var album = {};
                              
                              if (details[0] && details[0].a) {
                                  album.url = details[0].a.href;
                                  album.name = details[0].a.content.replace(/^[\s\n\r\t]*/, '').replace(/[\s\n\r\t]*$/, '');
                              }
                              
                              if (details[1] && details[1].div) {
                                  album.score = details[1].div.content;
                              }
                              
                              if (details[2] && details[2].ul && Array.isArray(details[2].ul.li)) {
                                  var stats = details[2].ul.li;
                                  
                                  if (stats[0] && Array.isArray(stats[0].span)) {
                                      if (stats[0].span[1]) {
                                          album.artist = stats[0].span[1].content;
                                      }
                                  }
                                  
                                  if (stats[2] && Array.isArray(stats[2].span)) {
                                      if (stats[2].span[1]) {
                                          album.releaseDate = stats[2].span[1].content;
                                      }
                                  }
                              }
                              
                              albums.push(album);
                          }    
                      })
                  }
              } catch(ex) {
                  context.done('Exception encountered while parsing http response: ' + ex);
              }
              
              if (albums.length > 0) {
                  uploadAlbum(context, albums.reverse(), -1, start);
              } else {
                  context.done(null, { 'success': false, 'albums fetched': albums.length, 'response': body });
              }
          });    
      } else {
          context.done('HTTP Response: ' + rsp.statusCode);
      }
  }).on('error', function(e) {
      console.log("error: " + e.message);
      context.done("error: " + e.message);
  });  
}

function uploadAlbum(context, albums, i, count) {
    i++;
    
    try {
        var a = albums[i];
        var date, year, day, month, releaseDate;
        var parms;
        
        console.log('Processing album ' + (i + 1) + ' out of ' + albums.length);
    
        if (parseInt(a.score) >= 60) {
            count++;
            
            date = new Date(a.releaseDate);
            year = date.getFullYear();
            day = date.getDate();
            month = 1 + date.getMonth();
            
            if (day < 10) day = '0' + day;
            if (month < 10) month = '0' + month;
            
            releaseFullDate = parseInt('' + year + month + day);
            releaseMonthDay = '' + month + day;
            parms = {
                TableName: 'Metaspot',
                Key: {
                    parmId: 'Y' + year 
                }
            };
            
            docClient.get(parms, function(err, data) {
                if (err) {
                    console.log("Dynamodb get Metaspot item error: " + err);
                } else {
                    var dates = [releaseMonthDay];
                    
                    if (typeof data.Item === 'object' && Array.isArray(data.Item.dates)) {
                        dates = data.Item.dates;
                    }
                    
                    if (dates.indexOf(releaseMonthDay) < 0) {
                        dates.push(releaseMonthDay);
                    }
                    
                    parms = {
                        TableName: 'Metaspot',
                        Item: {
                            parmId: 'Y' + year,
                            dates: dates
                        }
                    };
                    
                    docClient.put(parms, function(err, data) {
                        if (err) {
                            console.log("Dynamodb put Metaspot item error: " + err);
                        } else {
                            parms = {
                                TableName: "FetchedAlbums",
                                Item: {
                                    metaUrl: a.url,
                                    name: a.name,
                                    score: a.score,
                                    artist: a.artist,
                                    releaseDate: releaseFullDate
                                }
                            };
                            
                            docClient.put(parms, function(err, data) {
                                if (err) {
                                    console.log("Dynamodb put FetchedAlbums item error: " + err);
                                } else {
                                    if (i == albums.length - 1) {
                                        context.done(null, { 'success': true, 'albums fetched': albums.length, 'albums added': count });
                                    } else {
                                        uploadAlbum(context, albums, i, count);
                                    }
                                }
                            });
                        }
                    });
                }
            });
        } else {
            if (i == albums.length - 1) {
                context.done(null, { 'success': true, 'albums fetched': albums.length, 'albums added': count });
            } else {
                uploadAlbum(context, albums, i, count);
            }
        } 
    } catch(ex) {
        console.log('Exception encountered while uploading album ' + i + ': ' + ex);
    }
}

exports.handler = (event, context, callback) => {
  var domain = 'http://www.metacritic.com';
  var path = '/browse/albums/release-date/available/date'
  var userAgent = 'Mozilla/5.0 (iPad; U; CPU OS 3_2_1 like Mac OS X; en-us)'
  userAgent += ' AppleWebKit/531.21.10 (KHTML, like Gecko) Mobile/7B405'
  
  request({
    url: domain + path + '?page=' + page,
    headers: {
      'User-Agent': userAgent
    }
  }, function (err, rsp, body) {
    if (!err && rsp.statusCode == 200) {
      var $ = Cheerio.load(body);

      $('div.body_wrap li.release_product').each(function(i, el) {
        var $el = $(this);
        var $product_title = $el.find('.product_title > a').eq(0);
        var name = $product_title.html();
        name = name.replace(/^\s*/, '').replace(/\s*$/, '');
        var metaUrl = $product_title.attr('href');
        var score = $el.find('.metascore_w').html();
        var artist = $el.find('.product_artist > span:last-child').html();
        var releaseDate = $el.find('.release_date > span:last-child').html();
        
        console.log(name + ': ' + score);
      })
    }
  })
};
