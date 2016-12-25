'use strict';

var request = require('request')
var utils = require('utils')
var UA = 'Mozilla/5.0 (iPad; U; CPU OS 3_2_1 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Mobile/7B405'

module.exports = function(main, context, callback) {
  var U = new utils(context, callback)
  
  this.open = function (url) {
    request({
      url: url,
      headers: {
        'User-Agent': UA
      }
    }, function (err, rsp, body) {
      if (!err && rsp.statusCode == 200) {
        main.next(body)
      } else {
        U.print('crawler.open', err, {})
      }
    })
  }
}