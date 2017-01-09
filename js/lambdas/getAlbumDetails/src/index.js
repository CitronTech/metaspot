'use strict';

var dynamo = require('dynamo')
var metaspot = require('metaspot')
var crawler = require('crawler')
var utils = require('utils')

var SPOTIFY_ALBUM_BASE_URL = ''
var SPOTIFY_ALBUM_BASE_URI = 'spotify:album'

var SPOTIFY_TRACK_BASE_URL = 'https://open.spotify.com/track/'
var SPOTIFY_TRACK_BASE_URI = 'spotify:track:'

exports.handler = (event, context, callback) => {
  var album = {
    releaseDate: null,
    url: null,
    name: null,
    genre: null,
    cover: null,
    tracks: null,
    spotifyInfo: null
  }
  
  function *main() {
    var i, track
    
    if (typeof event.year === 'number' &&
      typeof event.dateKeyIndex === 'number' &&
      typeof event.index === 'number') {
      
      U.next(M.getQuery('Metaspot', { 
        year: event.year
      }))
      
      U.next(yield D.run('get', U.value))
      
      album.releaseDate = M.parseDynamoResult('Metaspot', U.value, {
        year: event.year,
        dateKeyIndex: event.dateKeyIndex
      })

      U.next(M.getQuery('FetchedAlbums', {
        releaseDate: album.releaseDate
      }))
      
      U.next(yield D.run('query', U.value))
      
      album.url = U.value.Items[event.index].metaUrl
      album.name = U.value.Items[event.index].name
      
      U.next(yield C.open('http://www.metacritic.com' + album.url + '/details'))
      album.genre = M.parseHtml('getAlbumGenre', U.value)
      
      U.next(yield C.open('https://api.spotify.com/v1/search?q="' + encodeURIComponent(album.name) + '"&type=album', { json: true }))
      album.spotifyInfo = M.parseSpotifyAlbumInfo(U.value)
      
      album.cover = yield C.open(album.spotifyInfo.coverURL, { encodeBase64: true })

      U.next(yield C.open('https://api.spotify.com/v1/albums/' + album.spotifyInfo.id, { json: true }))
      album.tracks = M.parseAlbumTracks(U.value)
      
      for (i=0; i<album.tracks.length; i++) {
        track = album.tracks[i]
        U.next(yield C.open('https://api.spotify.com/v1/tracks/' + track.id, { json: true }))
        track.popularity = M.getTrackPopularity(U.value)
      }
      
      try {
        album.tracks = JSON.stringify(album.tracks)
      } catch(ex) {
        U.print('JSON stringify tracks', ex, { tracks: album.tracks}) 
      }
      
      U.next(M.getQuery('updateFetchedAlbum', album))
      D.run('update', U.value)
    } else {
      album = {
        success: false,
        error: 'Invalid handler parameters'
      }
    }
    
    callback(null, album)
  }
  
  var it = main()
  var U = new utils(context, callback)
  var M = new metaspot(U)
  var D = new dynamo(it, U)
  var C = new crawler(it, U) 

  it.next()
}
