var serve = require('../index.js');

serve(function (req, res) {
  res.send('Hello World');
  res.end();
})