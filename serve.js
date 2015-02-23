
module.exports = require('./lib/server');
utils = require('./lib/util');

// -----------------------------
// override some globals

global.setTimeout = require('./lib/timers').setTimeout;

// -----------------------------
// provide a node.js like logger

function log() {
    __goLog(utils.format.apply(utils, arguments));
}

console = {log:log,warn:log,error:log,info:log};
