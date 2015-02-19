var serve = require('../serve.js');

serve(function (req, res) {
  res.send('Hello World');
  res.end();
})