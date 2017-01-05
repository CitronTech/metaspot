'use strict';

var cheerio = require('cheerio')

module.exports = function(U) {
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

    return U.checkOutput(result, 'metaspot.parseResponse', ex, { name, rsp, parms })
  }
  
  this.getQuery = function(name, parms) {
    var ex, query = undefined
    
    try {
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
        var $ = cheerio.load(body)
        
        if (name == 'getAlbumGenre') {
          var $el = $('#main .product_details td')
          
          if ($el.length > 1) {
            result = $el.eq(1).html()
            result = result.replace(/\s+/g, '')
          } else {
            throw ''
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
