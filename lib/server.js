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
    var req = Request(options);
    var res = Response();

    if (typeof(req.path) == "undefined" || !req.path) {
        throw new TypeError("Request.path can't be empty");
    }

    this.router(req, res, function() {
        console.log("no handler found, fell through to final handler", arguments);
        res.end();
    });
}

// express.js compatibility
server.prototype.listen = function() {
}

// ------------------------------
// expose server constructor

exports = module.exports = function() {
    return new server();
};

module.exports.static = function(dir) {
    return function(req, res) {
        __goServeStatic(dir, req.url)
    }
}
