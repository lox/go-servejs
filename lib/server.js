var Router = require('router');
var Request = require('./request');
var Response = require('./response');

// -----------------------------
// express-like server object

var server = function() {
    this.router = Router();
}

server.prototype.set = function() {
}

server.prototype.get = function() {
    return this.router.get.apply(this.router, arguments);
}

server.prototype.use = function() {
    return this.router.use.apply(this.router, arguments);
}

server.prototype.serve = function(options) {
    this.router(Request(options), Response(), function(r, res) {
        res.end();
    });
}

// ------------------------------
// expose server constructor

exports = module.exports = function() {
    return new server();
};
