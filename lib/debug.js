var debug = require("../node_modules/debug/browser.js");

// override for running in go-servejs environment
if (typeof(__goEnv) != 'undefined') {
    var util = require("./util.js")

    debug.log = function() {
        __goLog(util.format.apply(util, arguments))
    }

    debug.useColors = function() {
        return true;
    }

    debug.colors = [6, 2, 3, 4, 5, 1];

    debug.formatArgs = function() {
        var args = arguments;
        var name = this.namespace;
        var c = this.color;

        args[0] = '\u001b[9' + c + 'm' + name + ' '
        + '\u001b[0m'
        + args[0] + '\u001b[3' + c + 'm'
        + ' +' + debug.humanize(this.diff) + '\u001b[0m';

        return args;
    }

    var env = __goEnv();
    debug.enable(env.DEBUG);
}

exports = module.exports = debug;
