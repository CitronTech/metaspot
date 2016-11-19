'use strict';

var dynamo = require('dynamo')
var metaspot = require('metaspot')
var crawler = require('crawler')

exports.handler = (event, context, callback) => {
  var state = {
    query: null,
    data: null,
    releaseDate: null,
    year: event.year,
    index: event.index,
    dateKeyIndex: event.dateKeyIndex,
    album: {
      url: null,
      name: null,
      genre: null
    },
    albumDetailsHtml: null
  };
  
  function *main() {
    state.query = M.getQuery('Metaspot', { 
      year: state.year
    })
    
    state.data = yield D.get(state.query)
    
    state.releaseDate = M.parseDynamoResult('Metaspot', state.data, {
      year: state.year,
      dateKeyIndex: state.dateKeyIndex
    })
    
    state.query = M.getQuery('FetchedAlbums', { 
      releaseDate: state.releaseDate
    })
    
    state.data = yield D.query(state.query)
    state.album.url = state.data.Items[event.index].metaUrl
    state.album.name = state.data.Items[event.index].name
    state.albumDetailsHtml = yield C.open('http://www.metacritic.com' + state.album.url + '/details')
    state.album.genre = M.parseHtml('getAlbumGenre', state.albumDetailsHtml)
  }
  
  var it = main()
  var D = new dynamo(context, it)
  var M = new metaspot(context, callback)
  var C = new crawler()
  
  it.next()
}
