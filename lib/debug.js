
var debug = require("../node_modules/debug/browser.js");

debug.log = function() {
    __goLog.apply(null, arguments);
}

debug.useColors = function() {
    return false;
}

var env = __goEnv();
debug.enable(env.DEBUG);

exports = module.exports = debug;
