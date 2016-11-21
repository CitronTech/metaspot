'use strict';

exports.handler = (event, context, callback) => {
  console.log(event.i);
  callback(null, { result: 'ok' });
  //context.done(null, { result: 'hello world.' });
}
