'use strict';

var cheerio = require('cheerio')
var utils = require('utils')

module.exports = function(context) {
  var U = new utils(context)
  
  this.parseDynamoResult = function(name, rsp, parms) {
    var ex, result  = undefined

    try {
      if (name == 'Metaspot') {
        if (typeof parms.year === 'number' && typeof parms.dateKeyIndex === 'number') {
          result = parseInt(parms.year + '' + rsp.Item.dates[parms.dateKeyIndex])
          
          if (isNaN(result)) throw 'ParseIntError: result isNaN'
        }
      }
    } catch(_ex) {
      ex = _ex
      result = undefined
    }

    return U.checkOutput(result, 'metaspot.parseResponse', ex, { name, rsp, parms });
  }
  
  this.getQuery = function(name, parms) {
    var ex, query = undefined
    
    if (name == 'Metaspot') {
      if (parms && parms.year) {
        query = {
          TableName: 'Metaspot',
          Key: {
            parmId: 'Y' + parms.year
          }
        }
      }
    }
    
    if (name == 'FetchedAlbums') {
      if (parms && parms.releaseDate) {
        query = {
          TableName: 'FetchedAlbums',
          KeyConditionExpression: 'releaseDate = :date',
          ExpressionAttributeValues: {
            ':date': parms.releaseDate
          }
        }
      }
    } 
    
    return U.checkOutput(query, 'metaspot.getQuery', ex, { name, parms });
  }
  
  this.parseHtml = function(name, body) {
    var ex, result = undefined;
    
    if (typeof body === 'string') {
      try {
        var $ = cheerio.load(body);
        
        if (name == 'getAlbumGenre') {
          var $el = $('#main .product_details td');
          
          if ($el.length > 1) {
            result = $el.eq(1).html();
            result = result.replace(/\s+/g, '');
          } else {
            throw '';
          }
        }
      } catch(_ex) {
        ex = _ex;
        result = undefined;
      }
    }
    
    return U.checkOutput(result, 'metaspot.parseHtml', ex, { name, body });
  }
}
