'use strict';

var debug = require('debug')('serve:response');

function createResponse() {
    var _endCalled = false;
    var _headers = {};
    var _data = "";

    var response = {};
    response.statusCode = -1;
    response.cookies = {};

    // Returns a particular header by name.
    response.get = response.getHeader = function(name) {
        return _headers[name];
    };

    // Set a particular header by name.
    response.set = response.setHeader = function(name, value) {
        _headers[name] = value;
        return value;
    };

    // write to a buffer, prior to a send
    response.write = function(data) {
        _data += data
    }

    response.writeHead = function(statusCode, statusMsg, headers) {
        Object.keys(headers).forEach(function(key){
            debug("header %s='%s'", key, headers[key]);
            __goHeader(key, headers[key]);
        });
        __goWriteHeader(statusCode);
        debug("http status %d", statusCode);
    }

    // send data to client
    response.send = function(data) {
        if (typeof(data) == "string") {
            response.end(data);
        } else {
            throw new TypeError("type not supported");
        }
    }

    // end the response
    response.end = function(data, encoding) {
        if (_endCalled) {
            throw 'The end() method has already been called.';
        }

        try {
            response.writeHead(response.statusCode, "", _headers);
        } catch(e) {
            __goWriteHeader(500);
            __goWrite(e.toString() + " on line " + e.lineNumber);
            __goEnd();
            return;
        }

        __goWrite(_data + data);
        _endCalled = true;
        debug("done");
        __goEnd();
    }

    return response;
}

exports = module.exports = createResponse;
