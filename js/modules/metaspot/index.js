'use strict';

var cheerio = require('cheerio')

module.exports = function(U) {
  this.parseDynamoResult = function(name, rsp, parms) {
    var ex, result  = undefined

    try {
      if (name == 'MetaspotReleaseDateQuery') {
        if (typeof parms.year === 'number' && typeof parms.dateKeyIndex === 'number') {
          result = parseInt(parms.year + '' + rsp.Item.dates[parms.dateKeyIndex])
          
          if (isNaN(result)) throw 'ParseIntError: result isNaN'
        }
      }
    } catch(_ex) {
      ex = _ex
      result = undefined
    }

    return U.checkOutput(result, 'metaspot.parseResponse', ex, { name, rsp, parms })
  }
  
  this.getQuery = function(name, parms) {
    var ex, query = undefined
    var it = {}
    
    try {
      if (name == 'getMetaspotDatesByYear') {
        if (parms.releaseDate) {
          it.date = new Date(parms.releaseDate)

          query = {
            TableName: 'Metaspot',
            Key: {
                parmId: 'Y' + it.date.getFullYear()
            }
          }
        }
      }
      
      if (name == 'putMetaspotDates') {
        if (parms.data && parms.year && parms.releaseDateMMDD) {
          it.dates = [parms.releaseDateMMDD]
          
          if (typeof parms.data.Item === 'object' &&
            Array.isArray(parms.data.Item.dates)) {
            
            it.dates = parms.data.Item.dates
          }
          
          if (it.dates.indexOf(parms.releaseDateMMDD) < 0) {
            it.dates.push(parms.releaseDateMMDD)
          }
          
          query = {
            TableName: 'Metaspot',
            Item: {
              parmId: 'Y' + parms.year,
              dates: it.dates
            }
          }
        }
      }
      
      if (name == 'putFetchedAlbum') {
        if (parms.album && parms.releaseDate) {
          query = {
            TableName: 'FetchedAlbums',
            //ConditionExpression: 'attribute_not_exists(name) AND attribute_not_exists(releaseDate)',
            Item: {
              metaUrl: parms.album.metaUrl,
              name: parms.album.name,
              score: parms.album.score,
              artist: parms.album.artist,
              releaseDate: parms.releaseDate
            }
          }
        }
      }
      
      if (name == 'updateMetaspotLastAlbum') {
        if (parms.album && parms.releaseDate) {
          query = {
            TableName: 'Metaspot',
            Key: {
              parmId: 'lastAlbum',
            },
            UpdateExpression: "SET album = :album",
            ExpressionAttributeValues: {
              ':album': { name: parms.album.name, releaseDate: parms.releaseDate }
            }
          }
        } 
      }
      
      if (name == 'Metaspot') {
        query = {
          TableName: 'Metaspot',
          Key: {
            parmId: 'Y' + parms.year
          }
        }
      }
      
      if (name == 'FetchedAlbums') {
        query = {
          TableName: 'FetchedAlbums',
          KeyConditionExpression: 'releaseDate = :date',
          ExpressionAttributeValues: {
            ':date': parms.releaseDate
          }
        }
      } 
      
      if (name == 'updateFetchedAlbum') {
        query = {
          TableName: 'FetchedAlbums',
          Key: {
            releaseDate: parms.releaseDate,
            name: parms.name
          },
          UpdateExpression: "SET cover = :cover, genre = :genre, tracks = :tracks",
          ExpressionAttributeValues: { 
            ':cover': parms.cover,
            ':genre': parms.genre,
            ':tracks': parms.tracks
          }
        }
      }  
    } catch(_ex) {
      ex = _ex
      query = undefined
    }
    
    return U.checkOutput(query, 'metaspot.getQuery', ex, { name, parms })
  }
  
  this.getAlbumDates = function(album) {
    var ex, result = undefined
    
    try {
      var date = new Date(album.releaseDate)
      var year = date.getFullYear()
      var day = date.getDate()
      var month = 1 + date.getMonth()
      
      if (day < 10) day = '0' + day
      if (month < 10) month = '0' + month
      
      result = {
        full: parseInt('' + year + month + day),
        mmdd: '' + month + day,
        yyyy: year
      }
    } catch(_ex) {
      ex = _ex
      result = undefined
    }
    
    return U.checkOutput(result, 'metaspot.getAlbumDates', ex, { album })
  }
  
  this.getTrackPopularity = function(trackInfo) {
    var ex, result = undefined
    
    if (typeof trackInfo === 'object' && typeof trackInfo.popularity === 'number') {
      result = trackInfo.popularity  
    }
    
    return U.checkOutput(result, 'metaspot.getTrackPopularity', ex, { trackInfo })
  }
  
  this.parseHtml = function(name, body) {
    var ex, result = undefined
    
    if (typeof body === 'string') {
      try {
        var $ = cheerio.load(body, { decodeEntities: false })
        
        if (name == 'getAlbums') {
          var $items = $('div.body_wrap li.release_product')
          
          if ($items.length) {
            result = {
              albums: []
            }
            
            $items.each(function(i, el) {
              var $el = $(this)
              var album = {}
              
              var $title = $el.find('.product_title > a').eq(0)
              var $score = $el.find('.metascore_w').eq(0)
              var $artist = $el.find('.product_artist > span:last-child').eq(0)
              var $releaseDate = $el.find('.release_date > span:last-child').eq(0)
              
              if ($title.length && $score.length && $artist.length && $releaseDate.length) {
                album.name = $title.html()
                album.name = album.name.replace(/^\s*/, '').replace(/\s*$/, '')
                album.metaUrl = $title.attr('href')
                
                album.score = $score.html()
                album.artist = $artist.html()
                album.releaseDate = $releaseDate.html()
        
                result.albums.push(album)
              } else {
                throw `Expected DOM node missing in getAlbums { 
                  title: ${$title.length}, 
                  score: ${$score.length}, 
                  artist: ${$artist.length}, 
                  releaseDate: ${$releaseDate.length}
                }`
              }
            })
          } else {
            throw `Expected DOM node missing in getAlbums { items: ${$items.length} }`
          }
        }
        
        if (name == 'getAlbumGenre') {
          var $el = $('#main .product_details td')
          
          if ($el.length > 1) {
            result = $el.eq(1).html()
            result = result.replace(/\s+/g, '')
          } else {
            throw 'Expected DOM node missing in getAlbumGenre'
          }
        }
      } catch(_ex) {
        ex = _ex
        result = undefined
      }
    }
    
    return U.checkOutput(result, 'metaspot.parseHtml', ex, { name, body })
  }
  
  this.parseSpotifyAlbumInfo = function(albumDetails) {
    var a, i, ex, result = undefined
    
    if (typeof albumDetails === 'object' &&
      typeof albumDetails.albums === 'object' &&
      Array.isArray(albumDetails.albums.items)) {
      
      result = {}
      
      for (i=0; i<albumDetails.albums.items.length; i++) {
        a = albumDetails.albums.items[i]
        
        if (a.album_type == 'album') {
          if (Array.isArray(a.images) && a.images.length > 1) {
            result.coverURL = a.images[1].url  
          }
          
          result.id = a.id
          
          break;
        }  
      }
    }
    
    return U.checkOutput(result, 'metaspot.parseAlbumInfo', ex, { albumDetails })
  }
  
  this.parseAlbumTracks = function(tracksInfo) {
    var ex, result = undefined
    
    if (typeof tracksInfo === 'object' &&
      typeof tracksInfo.tracks === 'object' &&
      Array.isArray(tracksInfo.tracks.items)) {
      
      result = []
      
      tracksInfo.tracks.items.forEach(function(t) {
        result.push({
          id: t.id,
          number: t.track_number
        })  
      })
    }
    
    return U.checkOutput(result, 'metaspot.parseAlbumTracks', ex, { tracksInfo })
  }
}
