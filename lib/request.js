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
    request.params = (options.params) ? options.params : {};
    request.session = (options.session) ? options.session : {};
    request.cookies = (options.cookies) ? options.cookies : {};
    request.headers = (options.headers) ? options.headers : {};
    request.body = (options.body) ? options.body : {};
    request.query = (options.query) ? options.query : {};
    request.files = (options.files) ? options.files : {};

    //parse query string from url to object
    if (Object.keys(request.query).length == 0) {
        request.query = require('querystring').parse(request.url.split('?')[1])
    }

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

    /**
     * Function: _setParameter
     *
     *    Set parameters that the client can then get using the 'params'
     *    key.
     *
     * Parameters:
     *
     *   key - The key. For instance, 'bob' would be accessed: request.params.bob
     *   value - The value to return when accessed.
     */
    request._setParameter = function(key, value) {
        request.params[key] = value;
    };

    /**
     * Sets a variable that is stored in the session.
     *
     * @param variable The variable to store in the session
     * @param value    The value associated with the variable
     */
    request._setSessionVariable = function(variable, value) {
        request.session[variable] = value;
    };

    /**
     * Sets a variable that is stored in the cookies.
     *
     * @param variable The variable to store in the cookies
     * @param value    The value associated with the variable
     */
    request._setCookiesVariable = function(variable, value) {
        request.cookies[variable] = value;
    };

    /**
     * Sets a variable that is stored in the headers.
     *
     * @param variable The variable to store in the headers
     * @param value    The value associated with the variable
     */
    request._setHeadersVariable = function(variable, value) {
        request.headers[variable] = value;
    };

    /**
     * Sets a variable that is stored in the files.
     *
     * @param variable The variable to store in the files
     * @param value    The value associated with the variable
     */
    request._setFilesVariable = function(variable, value) {
        request.files[variable] = value;
    };

    /**
     * Function: _setMethod
     *
     *    Sets the HTTP method that the client gets when the called the 'method'
     *    property. This defaults to 'GET' if it is not set.
     *
     * Parameters:
     *
     *   method - The HTTP method, e.g. GET, POST, PUT, DELETE, etc.
     *
     * Note: We don't validate the string. We just return it.
     */
    request._setMethod = function(method) {
        request.method = method;
    };

    /**
     * Function: _setURL
     *
     *    Sets the URL value that the client gets when the called the 'url'
     *    property.
     *
     * Parameters:
     *
     *   url - The request path, e.g. /my-route/452
     *
     * Note: We don't validate the string. We just return it. Typically, these
     * do not include hostname, port or that part of the URL.
     */
    request._setURL = function(url) {
        request.url = url;
    };

    /**
     * Function: _setBody
     *
     *    Sets the body that the client gets when the called the 'body'
     *    parameter. This defaults to 'GET' if it is not set.
     *
     * Parameters:
     *
     *   body - An object representing the body.
     *
     * If you expect the 'body' to come from a form, this typically means that
     * it would be a flat object of properties and values, as in:
     *
     * > {  name: 'Howard Abrams',
     * >    age: 522
     * > }
     *
     * If the client is expecting a JSON object through a REST interface, then
     * this object could be anything.
     */
    request._setBody = function(body) {
        request.body = body;
    };

    /**
     * Function: _addBody
     *
     *    Adds another body parameter the client gets when calling the 'body'
     *    parameter with another property value, e.g. the name of a form element
     *    that was passed in.
     *
     * Parameters:
     *
     *   key - The key. For instance, 'bob' would be accessed: request.params.bob
     *   value - The value to return when accessed.
     */
    request._addBody = function(key, value) {
        request.body[key] = value;
    };

    return request;

}

exports = module.exports = createRequest;