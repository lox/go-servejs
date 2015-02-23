var debug = require("../node_modules/debug/browser.js");

// override for running in go-servejs environment
if (typeof(__goEnv) != 'undefined') {
    var util = require("./util.js")

    debug.log = function() {
        __goLog(util.format.apply(util, arguments));
    }

    debug.useColors = function() {
        return false;
    }

    var env = __goEnv();
    debug.enable(env.DEBUG);
}

exports = module.exports = debug;
