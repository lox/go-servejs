'use strict';

/**
 * Function: createRequest
 *
 *    Creates a new mock 'request' instance. All values are reset to the
 *    defaults.
 *
 * Parameters:
 *
 *   options - An object of named parameters.
 *
 * Options:
 *
 *   method - The method value, see <request._setMethod>
 *   url    - The url value, see <request._setURL>
 *   params - The parameters, see <request._setParam>
 *   body   - The body values, , see <request._setBody>
 */

function createRequest(options) {
    if (!options) {
        options = {};
    }

    var request = {};
    request.method = (options.method) ? options.method : 'GET';
    request.url = (options.url) ? options.url : '';
    request.path = (options.path) ? options.path : '';
    request.query = (options.query) ? options.query : {};
    request.protocol = (options.protocol) ? options.protocol : {};
    request.params = (options.params) ? options.params : {};
    request.session = (options.session) ? options.session : {};
    request.cookies = (options.cookies) ? options.cookies : {};
    request.headers = (options.headers) ? options.headers : {};
    request.body = (options.body) ? options.body : {};
    request.files = (options.files) ? options.files : {};

    /**
     * Function: header
     *
     *   Returns a particular header by name.
     */
    request.header = function(name) {
        return request.headers[name];
    };

    /**
     * Function: get
     *
     *   An copy of header.
     */
    request.get = function(name) {
        return request.headers[name];
    };

    /**
     * Function: param
     *
     *   Return the value of param name when present.
     *   Lookup is performed in the following order:
     *   - req.params
     *   - req.body
     *   - req.query
     */
    request.param = function(parameterName) {
        if (request.params[parameterName]) {
            return request.params[parameterName];
        }
        else if (request.body[parameterName]) {
            return request.body[parameterName];
        }
        else if (request.query[parameterName]) {
            return request.query[parameterName];
        }
        else {
            return null;
        }
    };

    return request;

}

exports = module.exports = createRequest;
