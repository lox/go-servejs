var servejs = require('../index.js');
var app = servejs()
var debug = require('debug')('example');

debug("starting up");

// store our message to display
var message = "Hello World!"

// register a route
app.get('/', function(req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end(message + '\n');
})

// listen for requests
app.listen(3000, function(){
   debug("listening on port 3000");
});