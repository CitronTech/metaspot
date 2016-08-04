var AWS = require('aws-sdk');
var request = require('request');
var Cheerio = require('cheerio');

'use strict';

var docClient = new AWS.DynamoDB.DocumentClient();

var start = 0;
var page = 69;

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
        var album = {};
        var $product_title = $el.find('.product_title > a').eq(0);
        
        album.name = $product_title.html();
        album.name = name.replace(/^\s*/, '').replace(/\s*$/, '');
        album.metaUrl = $product_title.attr('href');
        album.score = $el.find('.metascore_w').html();
        album.artist = $el.find('.product_artist > span:last-child').html();
        album.releaseDate = $el.find('.release_date > span:last-child').html();
        
        console.log(album.name + ': ' + album.score);
      })
    }
  })
};
