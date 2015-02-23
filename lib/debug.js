
var util = require("./util.js")
var debug = require("../node_modules/debug/browser.js");

debug.log = function() {
    __goLog(util.format.apply(util, arguments));
}

debug.useColors = function() {
    return false;
}

var env = __goEnv();
debug.enable(env.DEBUG);

exports = module.exports = debug;
