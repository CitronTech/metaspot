'use strict';

module.exports = function(context, callback) {
  this.value = undefined
  
  this.next = function(v) {
    this.value = v
  }
  
  this.checkOutput = function(output, name, ex, args) {
    if (typeof output === 'undefined') {
      this.print(name, ex, args)
    }
    
    return output
  }
  
  this.print = function(name, ex, args) {
    console.log('ERROR in', name)
    console.log('ERROR exception: ', ex)
    
    for (var k in args) {
      console.log('ERROR arg[', k, ']:', args[k])
    }
    
    callback(null, { success: false })
    
    context.done()
  }
}
