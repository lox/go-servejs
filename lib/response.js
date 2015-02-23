'use strict';

function createResponse() {
    var _ended = false;
    var _headersSent = false;
    var _headers = {};

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

    // write to the response
    response.write = function(data) {
        __goWrite(data);
    }

    // send data to client
    response.send = function(data) {
        if (typeof(data) == "string") {
            response.write(data);
        } else {
            throw new TypeError("type not supported");
        }
    }

    // end the response
    response.end = function(data, encoding) {
        response.ended = true;

        if (data) {
            __goWrite(data);
        }

        __goEnd();
    }

    return response;
}

exports = module.exports = createResponse;