var Router = require('router');
var Request = require('./request');
var Response = require('./response');

// -----------------------------
// override some globals

// global.XMLHttpRequest = window.XMLHttpRequest = require("./xhr.js");
// global.setTimeout = require('./timers').setTimeout;
// global.window.localStorage = require('./localstorage');
// global.window.location = { protocol: "http" };

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

server.prototype.listen = function() {
    this.router(Request({method: "GET", url:"/"}), Response(), function(r, res) {
        res.end();
    });
}

// -----------------------------
// static file handler

var staticFile = function(filename) {
    this.filename = filename;
}

// ------------------------------
// expose server constructor

exports = module.exports = function() {
    return new server();
};

exports.static = function (filename) {
    return function(req, res){
        print("serving static file "+filename);
        staticFile(filename)
    }
}
