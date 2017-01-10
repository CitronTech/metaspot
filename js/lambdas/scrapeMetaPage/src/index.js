'use strict'

var dynamo = require('dynamo')
var metaspot = require('metaspot')
var crawler = require('crawler')
var utils = require('utils')

exports.handler = (event, context, callback) => {
  var result = undefined
  var a, i, lastAlbum, pageResults, albumDates
  var albums = [], saved = [], skipped = []
  var counts = { total: 0, valid: 0 }
  
  function *main() {
    if (typeof event.page === 'number') {
      U.next(yield C.open('http://www.metacritic.com/browse/albums/release-date/available/date?page=' + event.page))
      pageResults = M.parseHtml('getAlbums', U.value)
      
      lastAlbum = yield D.run('get', {
        TableName: 'Metaspot',
        Key: {
          parmId: 'lastAlbum'
        }
      })
      
      if (typeof pageResults === 'object' && Array.isArray(pageResults.albums)) {
        counts.total = pageResults.albums.length
        
        for (i=0; i<pageResults.albums.length; i++) {
          a = pageResults.albums[i]
          
          if (typeof lastAlbum === 'object'
            && typeof lastAlbum.Item === 'object'
            && typeof lastAlbum.Item.album === 'object') {
            
            if (a.name == lastAlbum.Item.album.name && a.releaseDate == lastAlbum.Item.album.releaseDate) {
              break
            }  
          }
          
          if (parseInt(a.score) >= 60) {
            counts.valid++
            U.next(M.getQuery('getMetaspotDatesByYear', a))
            U.next(yield D.run('get', U.value))
            
            albumDates = M.getAlbumDates(a)
            U.next(M.getQuery('putMetaspotDates', { releaseDateMMDD: albumDates.mmdd, data: U.value, year: albumDates.yyyy }))
            
            if (U.value && U.value.TableName && U.value.Item) {
              U.next(yield D.run('put', U.value))
            }
            
            U.next(M.getQuery('putFetchedAlbum', { album: a, releaseDate: albumDates.full }))
            U.next(yield D.run('put', U.value))
            
            if (i == 0 && event.saveLastAlbum) {
              U.next(M.getQuery('updateMetaspotLastAlbum', a))
              yield D.run('update', U.value)
            }
            
            saved.push(a)
          } else {
            skipped.push(a)
          }
        }
        
        result = {
          success: true,
          counts,
          skipped
        }
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
  var U = new utils(event, context, callback)
  var M = new metaspot(U)
  var D = new dynamo(it, U)
  var C = new crawler(it, U) 

  it.next()
};
