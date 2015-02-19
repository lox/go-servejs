
window.XMLHttpRequest = {}

var superagent = require("superagent");

// expose the serve function
exports = module.exports = function(f) {
  f(new request(), new response());
};

// -----------------------------
// response object

var response = function() {
}

response.prototype.send = function(data) {
  __goWrite(data);
}

response.prototype.end = function() {
  __goEnd();
}

// -----------------------------
// request object

var request = function() {
}

/**
  * Mostly copied from original superagent source
  */

// var request = superagent.Request;

// // define func to avoid exeption
// function isHost(obj) {
//   var str = {}.toString.call(obj);
//   switch (str) {
//     case '[object File]':
//     case '[object Blob]':
//     case '[object FormData]':
//       return true;
//     default:
//       return false;
//   }
// }
// // Overwrite Request end method
// request.prototype.end = function(fn) {
//   var query = this._query.join('&');
//   var data = this._formData || this._data;
//   // store callback
//   this._callback = fn || function(){};
//   // querystring
//   if (query) {
//     query = request.serializeObject(query);
//     this.url += ~this.url.indexOf('?')
//       ? '&' + query
//       : '?' + query;
//   }
//   // body
//   if ('GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !isHost(data)) {
//     // serialize stuff
//     var serialize = request.serialize[this.getHeader('Content-Type')];
//     if (serialize) data = serialize(data);
//   }
//   var headers = {};
//   // set header fields
//   for (var field in this.header) {
//     if (null == this.header[field]) continue;
//     headers[field] = this.header[field];
//   }
//   this.emit('request', this);
//   this.__response__ = JSON.parse(__request__(JSON.stringify({
//     url: this.url,
//     method: this.method,
//     headers: headers,
//     body: data
//   })))
//   // Generate a response & call back
//   var err = null;
//   var res = null;
//   try {
//     res = new Response(this);
//   } catch(e) {
//     err = new Error('Parser is unable to parse the response');
//     err.parse = true;
//     err.original = e;
//   }
//   if (res) {
//     this.emit('response', res);
//   }
//   this._callback(err, res)
//   this._callback = function(){};
//   try {
//     this.emit('end');
//   } catch (e) {};
//   return this;
// };
// Response.prototype = Object.create(superagent.Response.prototype);
// for (var key in superagent.Response.prototype) {
//   Response.prototype[key] = superagent.Response.prototype[key];
// };

// // Overwrite the Response constructor
// function Response(req, options) {
//   options = options || {};
//   this.req = req;
//   this.__response__ = this.req.__response__;
//   this.text = this.req.method !='HEAD'
//      ? this.__response__.body
//      : null;
//   this.setStatusProperties(this.__response__.code);
//   this.header = this.headers = this.__response__.headers;
//   for (var key in this.header) {
//     this.header[key.toLowerCase()] = this.header[key].join();
//     delete this.header[key]
//   }
//   this.setHeaderProperties(this.header);
//   this.body = this.req.method != 'HEAD'
//     ? this.parseBody(this.text)
//     : null;
// };
