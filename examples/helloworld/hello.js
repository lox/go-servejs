var servejs = require('go-servejs');
var app = module.exports = servejs()
var debug = require('debug')('example');

// store our message to display
var message = "Hello World!"

// register a route
app.get('/', function(req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end(message + '\n');
})
