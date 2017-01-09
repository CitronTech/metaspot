'use strict'

var dynamo = require('dynamo')
var metaspot = require('metaspot')
var crawler = require('crawler')
var utils = require('utils')

exports.handler = (event, context, callback) => {
  var result = undefined
  var albumDates, counts = { total: 0, valid: 0 }
  
  function *main() {
    if (typeof event.page === 'number') {
      U.next(yield C.open('http://www.metacritic.com/browse/albums/release-date/available/date?page=' + event.page))
      U.next(M.parseHtml('getAlbums', U.value))
      
      if (typeof U.value === 'object' && Array.isArray(U.value.albums)) {
        counts.total = U.value.albums.length
        
        U.value.albums.forEach((a) => {
          if (parseInt(a.score) >= 60) {
            counts.valid++
            U.next(M.getQuery('getMetaspotDatesByYear', a))
            U.next(D.run('get', U.value))
            
            albumDates = M.getAlbumDates(a)
            U.next(M.getQuery('putMetaspotDates', { releaseDateMMDD: albumDates.mmdd, data: U.value, year: albumDates.yyyy }))
            
            if (U.value && U.value.TableName && U.value.Item) {
              U.next(D.run('put', U.value))
            }
            
            U.next(M.getQuery('putFetchedAlbum', { album: a, releaseDate: albumDates.full }))
            U.next(D.run('put', U.value))
          }
        })  
      } else {
        result = {
          success: false,
          error: 'Incorrect data type encountered when parsing metacritic page',
          value: U.value
        }
      }
    } else {
      result = {
        success: false,
        error: 'Invalid handler parameters'
      }
    }
    
    callback(null, result)
  }
  
  var it = main()
  var U = new utils(context, callback)
  var M = new metaspot(U)
  var D = new dynamo(it, U)
  var C = new crawler(it, U) 

  it.next()
};
