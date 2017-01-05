'use strict';

var request = require('request')
var UA = 'Mozilla/5.0 (iPad; U; CPU OS 3_2_1 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Mobile/7B405'

module.exports = function(main, U) {
  this.open = function (url, cfg) {
    request({
      url: url,
      json: cfg.json,
      headers: {
        'User-Agent': UA
      }
    }, function (err, rsp, body) {
      if (!err && rsp.statusCode == 200) {
        var result = undefined
        
        try {
          if (cfg.encodeBase64) {
            result = new Buffer(body).toString('base64')
          } else {
            result = body
          }
          
          main.next(result)
        } catch(ex) {
          U.print('crawler.open', ex, { url, body, cfg })
        }
      } else {
        U.print('crawler.open', err, { url, body, cfg })
      }
    })
  }
}