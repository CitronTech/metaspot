'use strict';

module.exports = function(context, callback) {
  this.checkOutput = function(output, name, ex, args) {
    if (typeof output === 'undefined') {
      this.print(name, ex, args)
    }
    
    return output
  }
  
  this.print = function(name, ex, args) {
    console.log('ERROR in', name, ':', ex)
    
    for (var k in args) {
      console.log('ERROR arg[', k, ']:', args[k])
    }
    
    callback();
    context.done();
  }
}
