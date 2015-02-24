
var stat = function() {
    this.fstype = false;
}

stat.prototype.isDirectory = function() {
    return false;
}

module.exports.statSync = function(){
    return new stat();
}
