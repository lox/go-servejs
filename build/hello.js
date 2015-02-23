/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var servejs = __webpack_require__(1);
	var app = servejs()
	var debug = __webpack_require__(2)('example');

	debug("starting up");

	// store our message to display
	var message = "Hello World!"

	// register a route
	app.get('/', function(req, res) {
	  res.statusCode = 200;
	  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
	  res.end(message + '\n');
	})

	// listen for requests
	app.listen(3000, function(){
	   debug("listening on port 3000");
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var Router = __webpack_require__(7);
	var Request = __webpack_require__(4);
	var Response = __webpack_require__(5);

	// -----------------------------
	// override some globals

	// global.XMLHttpRequest = window.XMLHttpRequest = require("./xhr.js");
	global.setTimeout = __webpack_require__(6).setTimeout;
	// global.window.localStorage = require('./localstorage');
	// global.window.location = { protocol: "http" };

	// -----------------------------
	// express-like server object

	var server = function() {
	    this.router = Router();
	}

	server.prototype.set = function() {
	}

	server.prototype.get = function() {
	    return this.router.get.apply(this.router, arguments);
	}

	server.prototype.use = function() {
	    return this.router.use.apply(this.router, arguments);
	}

	server.prototype.listen = function() {
	    this.router(Request({method: "GET", url:"/"}), Response(), function(r, res) {
	        res.end();
	    });
	}

	// -----------------------------
	// static file handler

	var staticFile = function(filename) {
	    this.filename = filename;
	}

	// ------------------------------
	// expose server constructor

	exports = module.exports = function() {
	    return new server();
	};

	exports.static = function (filename) {
	    return function(req, res){
	        print("serving static file "+filename);
	        staticFile(filename)
	    }
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	
	var debug = __webpack_require__(3);

	debug.log = function() {
	    __goLog.apply(null, arguments);
	}

	debug.useColors = function() {
	    return false;
	}

	var env = __goEnv();
	debug.enable(env.DEBUG);

	exports = module.exports = debug;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * This is the web browser implementation of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.exports = __webpack_require__(8);
	exports.log = log;
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;

	/**
	 * Use chrome.storage.local if we are in an app
	 */

	var storage;

	if (typeof chrome !== 'undefined' && typeof chrome.storage !== 'undefined')
	  storage = chrome.storage.local;
	else
	  storage = window.localStorage;

	/**
	 * Colors.
	 */

	exports.colors = [
	  'lightseagreen',
	  'forestgreen',
	  'goldenrod',
	  'dodgerblue',
	  'darkorchid',
	  'crimson'
	];

	/**
	 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
	 * and the Firebug extension (any Firefox version) are known
	 * to support "%c" CSS customizations.
	 *
	 * TODO: add a `localStorage` variable to explicitly enable/disable colors
	 */

	function useColors() {
	  // is webkit? http://stackoverflow.com/a/16459606/376773
	  return ('WebkitAppearance' in document.documentElement.style) ||
	    // is firebug? http://stackoverflow.com/a/398120/376773
	    (window.console && (console.firebug || (console.exception && console.table))) ||
	    // is firefox >= v31?
	    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
	    (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
	}

	/**
	 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	 */

	exports.formatters.j = function(v) {
	  return JSON.stringify(v);
	};


	/**
	 * Colorize log arguments if enabled.
	 *
	 * @api public
	 */

	function formatArgs() {
	  var args = arguments;
	  var useColors = this.useColors;

	  args[0] = (useColors ? '%c' : '')
	    + this.namespace
	    + (useColors ? ' %c' : ' ')
	    + args[0]
	    + (useColors ? '%c ' : ' ')
	    + '+' + exports.humanize(this.diff);

	  if (!useColors) return args;

	  var c = 'color: ' + this.color;
	  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

	  // the final "%c" is somewhat tricky, because there could be other
	  // arguments passed either before or after the %c, so we need to
	  // figure out the correct index to insert the CSS into
	  var index = 0;
	  var lastC = 0;
	  args[0].replace(/%[a-z%]/g, function(match) {
	    if ('%%' === match) return;
	    index++;
	    if ('%c' === match) {
	      // we only are interested in the *last* %c
	      // (the user may have provided their own)
	      lastC = index;
	    }
	  });

	  args.splice(lastC, 0, c);
	  return args;
	}

	/**
	 * Invokes `console.log()` when available.
	 * No-op when `console.log` is not a "function".
	 *
	 * @api public
	 */

	function log() {
	  // this hackery is required for IE8/9, where
	  // the `console.log` function doesn't have 'apply'
	  return 'object' === typeof console
	    && console.log
	    && Function.prototype.apply.call(console.log, console, arguments);
	}

	/**
	 * Save `namespaces`.
	 *
	 * @param {String} namespaces
	 * @api private
	 */

	function save(namespaces) {
	  try {
	    if (null == namespaces) {
	      storage.removeItem('debug');
	    } else {
	      storage.debug = namespaces;
	    }
	  } catch(e) {}
	}

	/**
	 * Load `namespaces`.
	 *
	 * @return {String} returns the previously persisted debug modes
	 * @api private
	 */

	function load() {
	  var r;
	  try {
	    r = storage.debug;
	  } catch(e) {}
	  return r;
	}

	/**
	 * Enable namespaces listed in `localStorage.debug` initially.
	 */

	exports.enable(load());


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

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
	        request.query = __webpack_require__(9).parse(request.url.split('?')[1])
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

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

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

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var timers = [];

	function createTimer(func, delay, oneshot) {
	    console.log("creating a timer", arguments);
	    // this.timers.push([func, delay, oneshot]);
	    if (delay > 0 || !oneshot) {
	        console.error("delayed timers not supported yet");
	    } else {
	        func();
	    }
	}

	function deleteTimer() {

	}

	function setTimeout(func, delay) {
	    var cb_func;
	    var bind_args;
	    var timer_id;

	    if (typeof delay !== 'number') {
	        throw new TypeError('delay is not a number');
	    }

	    if (typeof func === 'string') {
	        // Legacy case: callback is a string.
	        cb_func = eval.bind(this, func);
	    } else if (typeof func !== 'function') {
	        throw new TypeError('callback is not a function/string');
	    } else if (arguments.length > 2) {
	        // Special case: callback arguments are provided.
	        bind_args = Array.prototype.slice.call(arguments, 2);  // [ arg1, arg2, ... ]
	        bind_args.unshift(this);  // [ global(this), arg1, arg2, ... ]
	        cb_func = func.bind.apply(func, bind_args);
	    } else {
	        // Normal case: callback given as a function without arguments.
	        cb_func = func;
	    }

	    timer_id = createTimer(cb_func, delay, true /*oneshot*/);
	    return timer_id;
	}

	function clearTimeout(timer_id) {
	    if (typeof timer_id !== 'number') {
	        throw new TypeError('timer ID is not a number');
	    }
	    var success = deleteTimer(timer_id);  /* retval ignored */
	}

	function setInterval(func, delay) {
	    var cb_func;
	    var bind_args;
	    var timer_id;

	    if (typeof delay !== 'number') {
	        throw new TypeError('delay is not a number');
	    }

	    if (typeof func === 'string') {
	        // Legacy case: callback is a string.
	        cb_func = eval.bind(this, func);
	    } else if (typeof func !== 'function') {
	        throw new TypeError('callback is not a function/string');
	    } else if (arguments.length > 2) {
	        // Special case: callback arguments are provided.
	        bind_args = Array.prototype.slice.call(arguments, 2);  // [ arg1, arg2, ... ]
	        bind_args.unshift(this);  // [ global(this), arg1, arg2, ... ]
	        cb_func = func.bind.apply(func, bind_args);
	    } else {
	        // Normal case: callback given as a function without arguments.
	        cb_func = func;
	    }

	    timer_id = createTimer(cb_func, delay, false /*oneshot*/);
	    return timer_id;
	}

	function clearInterval(timer_id) {
	    if (typeof timer_id !== 'number') {
	        throw new TypeError('timer ID is not a number');
	    }
	    deleteTimer(timer_id);
	}

	exports = module.exports.setTimeout = setTimeout;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, process) {/*!
	 * router
	 * Copyright(c) 2013 Roman Shtylman
	 * Copyright(c) 2014 Douglas Christopher Wilson
	 * MIT Licensed
	 */

	/**
	 * Module dependencies.
	 * @private
	 */

	var debug = __webpack_require__(2)('router')
	var flatten = __webpack_require__(20)
	var Layer = __webpack_require__(10)
	var methods = __webpack_require__(14)
	var mixin = __webpack_require__(15)
	var parseUrl = __webpack_require__(16)
	var Route = __webpack_require__(11)

	/**
	 * Module variables.
	 * @private
	 */

	var slice = Array.prototype.slice

	/* istanbul ignore next */
	var defer = typeof setImmediate === 'function'
	  ? setImmediate
	  : function(fn){ process.nextTick(fn.bind.apply(fn, arguments)) }

	/**
	 * Expose `Router`.
	 */

	module.exports = Router

	/**
	 * Expose `Route`.
	 */

	module.exports.Route = Route

	/**
	 * Initialize a new `Router` with the given `options`.
	 *
	 * @param {object} options
	 * @return {Router} which is an callable function
	 * @public
	 */

	function Router(options) {
	  if (!(this instanceof Router)) {
	    return new Router(options)
	  }

	  var opts = options || {}

	  function router(req, res, next) {
	    router.handle(req, res, next)
	  }

	  // inherit from the correct prototype
	  router.__proto__ = this

	  router.caseSensitive = opts.caseSensitive
	  router.mergeParams = opts.mergeParams
	  router.params = {}
	  router.strict = opts.strict
	  router.stack = []

	  return router
	}

	/**
	 * Router prototype inherits from a Function.
	 */

	/* istanbul ignore next */
	Router.prototype = function () {}

	/**
	 * Map the given param placeholder `name`(s) to the given callback.
	 *
	 * Parameter mapping is used to provide pre-conditions to routes
	 * which use normalized placeholders. For example a _:user_id_ parameter
	 * could automatically load a user's information from the database without
	 * any additional code.
	 *
	 * The callback uses the same signature as middleware, the only difference
	 * being that the value of the placeholder is passed, in this case the _id_
	 * of the user. Once the `next()` function is invoked, just like middleware
	 * it will continue on to execute the route, or subsequent parameter functions.
	 *
	 * Just like in middleware, you must either respond to the request or call next
	 * to avoid stalling the request.
	 *
	 *  router.param('user_id', function(req, res, next, id){
	 *    User.find(id, function(err, user){
	 *      if (err) {
	 *        return next(err)
	 *      } else if (!user) {
	 *        return next(new Error('failed to load user'))
	 *      }
	 *      req.user = user
	 *      next()
	 *    })
	 *  })
	 *
	 * @param {string} name
	 * @param {function} fn
	 * @public
	 */

	Router.prototype.param = function param(name, fn) {
	  if (!name) {
	    throw new TypeError('argument name is required')
	  }

	  if (typeof name !== 'string') {
	    throw new TypeError('argument name must be a string')
	  }

	  if (!fn) {
	    throw new TypeError('argument fn is required')
	  }

	  if (typeof fn !== 'function') {
	    throw new TypeError('argument fn must be a function')
	  }

	  var params = this.params[name]

	  if (!params) {
	    params = this.params[name] = []
	  }

	  params.push(fn)

	  return this
	}

	/**
	 * Dispatch a req, res into the router.
	 *
	 * @private
	 */

	Router.prototype.handle = function handle(req, res, callback) {
	  if (!callback) {
	    throw new TypeError('argument callback is required')
	  }

	  debug('dispatching %s %s', req.method, req.url)

	  var idx = 0
	  var methods
	  var protohost = getProtohost(req.url) || ''
	  var removed = ''
	  var self = this
	  var slashAdded = false
	  var paramcalled = {}

	  // middleware and routes
	  var stack = this.stack

	  // manage inter-router variables
	  var parentParams = req.params
	  var parentUrl = req.baseUrl || ''
	  var done = restore(callback, req, 'baseUrl', 'next', 'params')

	  // setup next layer
	  req.next = next

	  // for options requests, respond with a default if nothing else responds
	  if (req.method === 'OPTIONS') {
	    methods = []
	    done = wrap(done, generateOptionsResponder(res, methods))
	  }

	  // setup basic req values
	  req.baseUrl = parentUrl
	  req.originalUrl = req.originalUrl || req.url

	  next()

	  function next(err) {
	    var layerError = err === 'route'
	      ? null
	      : err

	    // remove added slash
	    if (slashAdded) {
	      req.url = req.url.substr(1)
	      slashAdded = false
	    }

	    // restore altered req.url
	    if (removed.length !== 0) {
	      req.baseUrl = parentUrl
	      req.url = protohost + removed + req.url.substr(protohost.length)
	      removed = ''
	    }

	    // no more matching layers
	    if (idx >= stack.length) {
	      defer(done, layerError)
	      return
	    }

	    // get pathname of request
	    var path = getPathname(req)

	    if (path == null) {
	      return done(layerError)
	    }

	    // find next matching layer
	    var layer
	    var match
	    var route

	    while (match !== true && idx < stack.length) {
	      layer = stack[idx++]
	      match = matchLayer(layer, path)
	      route = layer.route

	      if (typeof match !== 'boolean') {
	        // hold on to layerError
	        layerError = layerError || match
	      }

	      if (match !== true) {
	        continue
	      }

	      if (!route) {
	        // process non-route handlers normally
	        continue
	      }

	      if (layerError) {
	        // routes do not match with a pending error
	        match = false
	        continue
	      }

	      var method = req.method;
	      var has_method = route._handles_method(method)

	      // build up automatic options response
	      if (!has_method && method === 'OPTIONS' && methods) {
	        methods.push.apply(methods, route._methods())
	      }

	      // don't even bother matching route
	      if (!has_method && method !== 'HEAD') {
	        match = false
	        continue
	      }
	    }

	    // no match
	    if (match !== true) {
	      return done(layerError)
	    }

	    // store route for dispatch on change
	    if (route) {
	      req.route = route
	    }

	    // Capture one-time layer values
	    req.params = self.mergeParams
	      ? mergeParams(layer.params, parentParams)
	      : layer.params
	    var layerPath = layer.path

	    // this should be done for the layer
	    self.process_params(layer, paramcalled, req, res, function (err) {
	      if (err) {
	        return next(layerError || err)
	      }

	      if (route) {
	        return layer.handle_request(req, res, next)
	      }

	      trim_prefix(layer, layerError, layerPath, path)
	    })
	  }

	  function trim_prefix(layer, layerError, layerPath, path) {
	    var c = path[layerPath.length]

	    if (c && c !== '/') {
	      next(layerError)
	      return
	    }

	     // Trim off the part of the url that matches the route
	     // middleware (.use stuff) needs to have the path stripped
	    if (layerPath.length !== 0) {
	      debug('trim prefix (%s) from url %s', layerPath, req.url)
	      removed = layerPath
	      req.url = protohost + req.url.substr(protohost.length + removed.length)

	      // Ensure leading slash
	      if (!protohost && req.url[0] !== '/') {
	        req.url = '/' + req.url
	        slashAdded = true
	      }

	      // Setup base URL (no trailing slash)
	      req.baseUrl = parentUrl + (removed[removed.length - 1] === '/'
	        ? removed.substring(0, removed.length - 1)
	        : removed)
	    }

	    debug('%s %s : %s', layer.name, layerPath, req.originalUrl)

	    if (layerError) {
	      layer.handle_error(layerError, req, res, next)
	    } else {
	      layer.handle_request(req, res, next)
	    }
	  }
	}

	/**
	 * Process any parameters for the layer.
	 *
	 * @private
	 */

	Router.prototype.process_params = function process_params(layer, called, req, res, done) {
	  var params = this.params

	  // captured parameters from the layer, keys and values
	  var keys = layer.keys

	  // fast track
	  if (!keys || keys.length === 0) {
	    return done()
	  }

	  var i = 0
	  var name
	  var paramIndex = 0
	  var key
	  var paramVal
	  var paramCallbacks
	  var paramCalled

	  // process params in order
	  // param callbacks can be async
	  function param(err) {
	    if (err) {
	      return done(err)
	    }

	    if (i >= keys.length ) {
	      return done()
	    }

	    paramIndex = 0
	    key = keys[i++]

	    if (!key) {
	      return done()
	    }

	    name = key.name
	    paramVal = req.params[name]
	    paramCallbacks = params[name]
	    paramCalled = called[name]

	    if (paramVal === undefined || !paramCallbacks) {
	      return param()
	    }

	    // param previously called with same value or error occurred
	    if (paramCalled && (paramCalled.error || paramCalled.match === paramVal)) {
	      // restore value
	      req.params[name] = paramCalled.value

	      // next param
	      return param(paramCalled.error)
	    }

	    called[name] = paramCalled = {
	      error: null,
	      match: paramVal,
	      value: paramVal
	    }

	    paramCallback()
	  }

	  // single param callbacks
	  function paramCallback(err) {
	    var fn = paramCallbacks[paramIndex++]

	    // store updated value
	    paramCalled.value = req.params[key.name]

	    if (err) {
	      // store error
	      paramCalled.error = err
	      param(err)
	      return
	    }

	    if (!fn) return param()

	    try {
	      fn(req, res, paramCallback, paramVal, key.name)
	    } catch (e) {
	      paramCallback(e)
	    }
	  }

	  param()
	}

	/**
	 * Use the given middleware function, with optional path, defaulting to "/".
	 *
	 * Use (like `.all`) will run for any http METHOD, but it will not add
	 * handlers for those methods so OPTIONS requests will not consider `.use`
	 * functions even if they could respond.
	 *
	 * The other difference is that _route_ path is stripped and not visible
	 * to the handler function. The main effect of this feature is that mounted
	 * handlers can operate without any code changes regardless of the "prefix"
	 * pathname.
	 *
	 * @public
	 */

	Router.prototype.use = function use(handler) {
	  var offset = 0
	  var path = '/'

	  // default path to '/'
	  // disambiguate router.use([handler])
	  if (typeof handler !== 'function') {
	    var arg = handler

	    while (Array.isArray(arg) && arg.length !== 0) {
	      arg = arg[0]
	    }

	    // first arg is the path
	    if (typeof arg !== 'function') {
	      offset = 1
	      path = handler
	    }
	  }

	  var callbacks = flatten(slice.call(arguments, offset))

	  if (callbacks.length === 0) {
	    throw new TypeError('argument handler is required')
	  }

	  callbacks.forEach(function (fn) {
	    if (typeof fn !== 'function') {
	      throw new TypeError('argument handler must be a function')
	    }

	    // add the middleware
	    debug('use %s %s', path, fn.name || '<anonymous>')

	    var layer = new Layer(path, {
	      sensitive: this.caseSensitive,
	      strict: false,
	      end: false
	    }, fn)

	    layer.route = undefined

	    this.stack.push(layer)
	  }, this)

	  return this
	}

	/**
	 * Create a new Route for the given path.
	 *
	 * Each route contains a separate middleware stack and VERB handlers.
	 *
	 * See the Route api documentation for details on adding handlers
	 * and middleware to routes.
	 *
	 * @param {string} path
	 * @return {Route}
	 * @public
	 */

	Router.prototype.route = function route(path) {
	  var route = new Route(path)

	  var layer = new Layer(path, {
	    sensitive: this.caseSensitive,
	    strict: this.strict,
	    end: true
	  }, handle)

	  function handle(req, res, next) {
	    route.dispatch(req, res, next)
	  }

	  layer.route = route

	  this.stack.push(layer)
	  return route
	}

	// create Router#VERB functions
	methods.concat('all').forEach(function(method){
	  Router.prototype[method] = function (path) {
	    var route = this.route(path)
	    route[method].apply(route, slice.call(arguments, 1))
	    return this
	  }
	})

	/**
	 * Generate a callback that will make an OPTIONS response.
	 *
	 * @param {OutgoingMessage} res
	 * @param {array} methods
	 * @private
	 */

	function generateOptionsResponder(res, methods) {
	  return function onDone(fn, err) {
	    if (err || methods.length === 0) {
	      return fn(err)
	    }

	    trySendOptionsResponse(res, methods, fn)
	  }
	}

	/**
	 * Get pathname of request.
	 *
	 * @param {IncomingMessage} req
	 * @private
	 */

	function getPathname(req) {
	  try {
	    return parseUrl(req).pathname;
	  } catch (err) {
	    return undefined;
	  }
	}

	/**
	 * Get get protocol + host for a URL.
	 *
	 * @param {string} url
	 * @private
	 */

	function getProtohost(url) {
	  if (url.length === 0 || url[0] === '/') {
	    return undefined
	  }

	  var searchIndex = url.indexOf('?')
	  var pathLength = searchIndex !== -1
	    ? searchIndex
	    : url.length
	  var fqdnIndex = url.substr(0, pathLength).indexOf('://')

	  return fqdnIndex !== -1
	    ? url.substr(0, url.indexOf('/', 3 + fqdnIndex))
	    : undefined
	}

	/**
	 * Match path to a layer.
	 *
	 * @param {Layer} layer
	 * @param {string} path
	 * @private
	 */

	function matchLayer(layer, path) {
	  try {
	    return layer.match(path);
	  } catch (err) {
	    return err;
	  }
	}

	/**
	 * Merge params with parent params
	 *
	 * @private
	 */

	function mergeParams(params, parent) {
	  if (typeof parent !== 'object' || !parent) {
	    return params
	  }

	  // make copy of parent for base
	  var obj = mixin({}, parent)

	  // simple non-numeric merging
	  if (!(0 in params) || !(0 in parent)) {
	    return mixin(obj, params)
	  }

	  var i = 0
	  var o = 0

	  // determine numeric gaps
	  while (i === o || o in parent) {
	    if (i in params) i++
	    if (o in parent) o++
	  }

	  // offset numeric indices in params before merge
	  for (i--; i >= 0; i--) {
	    params[i + o] = params[i]

	    // create holes for the merge when necessary
	    if (i < o) {
	      delete params[i]
	    }
	  }

	  return mixin(parent, params)
	}

	/**
	 * Restore obj props after function
	 *
	 * @private
	 */

	function restore(fn, obj) {
	  var props = new Array(arguments.length - 2)
	  var vals = new Array(arguments.length - 2)

	  for (var i = 0; i < props.length; i++) {
	    props[i] = arguments[i + 2]
	    vals[i] = obj[props[i]]
	  }

	  return function(err){
	    // restore vals
	    for (var i = 0; i < props.length; i++) {
	      obj[props[i]] = vals[i]
	    }

	    return fn.apply(this, arguments)
	  }
	}

	/**
	 * Send an OPTIONS response.
	 *
	 * @private
	 */

	function sendOptionsResponse(res, methods) {
	  var options = Object.create(null)

	  // build unique method map
	  for (var i = 0; i < methods.length; i++) {
	    options[methods[i]] = true
	  }

	  // construct the allow list
	  var allow = Object.keys(options).sort().join(', ')

	  // send response
	  res.setHeader('Allow', allow)
	  res.setHeader('Content-Length', Buffer.byteLength(allow))
	  res.setHeader('Content-Type', 'text/plain')
	  res.setHeader('X-Content-Type-Options', 'nosniff')
	  res.end(allow)
	}

	/**
	 * Try to send an OPTIONS response.
	 *
	 * @private
	 */

	function trySendOptionsResponse(res, methods, next) {
	  try {
	    sendOptionsResponse(res, methods)
	  } catch (err) {
	    next(err)
	  }
	}

	/**
	 * Wrap a function
	 *
	 * @private
	 */

	function wrap(old, fn) {
	  return function proxy() {
	    var args = new Array(arguments.length + 1)

	    args[0] = old
	    for (var i = 0, len = arguments.length; i < len; i++) {
	      args[i + 1] = arguments[i]
	    }

	    fn.apply(this, args)
	  }
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12).setImmediate, __webpack_require__(13)))

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * This is the common logic for both the Node.js and web browser
	 * implementations of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.exports = debug;
	exports.coerce = coerce;
	exports.disable = disable;
	exports.enable = enable;
	exports.enabled = enabled;
	exports.humanize = __webpack_require__(19);

	/**
	 * The currently active debug mode names, and names to skip.
	 */

	exports.names = [];
	exports.skips = [];

	/**
	 * Map of special "%n" handling functions, for the debug "format" argument.
	 *
	 * Valid key names are a single, lowercased letter, i.e. "n".
	 */

	exports.formatters = {};

	/**
	 * Previously assigned color.
	 */

	var prevColor = 0;

	/**
	 * Previous log timestamp.
	 */

	var prevTime;

	/**
	 * Select a color.
	 *
	 * @return {Number}
	 * @api private
	 */

	function selectColor() {
	  return exports.colors[prevColor++ % exports.colors.length];
	}

	/**
	 * Create a debugger with the given `namespace`.
	 *
	 * @param {String} namespace
	 * @return {Function}
	 * @api public
	 */

	function debug(namespace) {

	  // define the `disabled` version
	  function disabled() {
	  }
	  disabled.enabled = false;

	  // define the `enabled` version
	  function enabled() {

	    var self = enabled;

	    // set `diff` timestamp
	    var curr = +new Date();
	    var ms = curr - (prevTime || curr);
	    self.diff = ms;
	    self.prev = prevTime;
	    self.curr = curr;
	    prevTime = curr;

	    // add the `color` if not set
	    if (null == self.useColors) self.useColors = exports.useColors();
	    if (null == self.color && self.useColors) self.color = selectColor();

	    var args = Array.prototype.slice.call(arguments);

	    args[0] = exports.coerce(args[0]);

	    if ('string' !== typeof args[0]) {
	      // anything else let's inspect with %o
	      args = ['%o'].concat(args);
	    }

	    // apply any `formatters` transformations
	    var index = 0;
	    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
	      // if we encounter an escaped % then don't increase the array index
	      if (match === '%%') return match;
	      index++;
	      var formatter = exports.formatters[format];
	      if ('function' === typeof formatter) {
	        var val = args[index];
	        match = formatter.call(self, val);

	        // now we need to remove `args[index]` since it's inlined in the `format`
	        args.splice(index, 1);
	        index--;
	      }
	      return match;
	    });

	    if ('function' === typeof exports.formatArgs) {
	      args = exports.formatArgs.apply(self, args);
	    }
	    var logFn = enabled.log || exports.log || console.log.bind(console);
	    logFn.apply(self, args);
	  }
	  enabled.enabled = true;

	  var fn = exports.enabled(namespace) ? enabled : disabled;

	  fn.namespace = namespace;

	  return fn;
	}

	/**
	 * Enables a debug mode by namespaces. This can include modes
	 * separated by a colon and wildcards.
	 *
	 * @param {String} namespaces
	 * @api public
	 */

	function enable(namespaces) {
	  exports.save(namespaces);

	  var split = (namespaces || '').split(/[\s,]+/);
	  var len = split.length;

	  for (var i = 0; i < len; i++) {
	    if (!split[i]) continue; // ignore empty strings
	    namespaces = split[i].replace(/\*/g, '.*?');
	    if (namespaces[0] === '-') {
	      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
	    } else {
	      exports.names.push(new RegExp('^' + namespaces + '$'));
	    }
	  }
	}

	/**
	 * Disable debug output.
	 *
	 * @api public
	 */

	function disable() {
	  exports.enable('');
	}

	/**
	 * Returns true if the given mode name is enabled, false otherwise.
	 *
	 * @param {String} name
	 * @return {Boolean}
	 * @api public
	 */

	function enabled(name) {
	  var i, len;
	  for (i = 0, len = exports.skips.length; i < len; i++) {
	    if (exports.skips[i].test(name)) {
	      return false;
	    }
	  }
	  for (i = 0, len = exports.names.length; i < len; i++) {
	    if (exports.names[i].test(name)) {
	      return true;
	    }
	  }
	  return false;
	}

	/**
	 * Coerce `val`.
	 *
	 * @param {Mixed} val
	 * @return {Mixed}
	 * @api private
	 */

	function coerce(val) {
	  if (val instanceof Error) return val.stack || val.message;
	  return val;
	}


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.decode = exports.parse = __webpack_require__(17);
	exports.encode = exports.stringify = __webpack_require__(18);


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * router
	 * Copyright(c) 2013 Roman Shtylman
	 * Copyright(c) 2014 Douglas Christopher Wilson
	 * MIT Licensed
	 */

	/**
	 * Module dependencies.
	 * @private
	 */

	var pathRegexp = __webpack_require__(22)
	var debug = __webpack_require__(2)('router:layer')

	/**
	 * Module variables.
	 * @private
	 */

	var hasOwnProperty = Object.prototype.hasOwnProperty

	/**
	 * Expose `Layer`.
	 */

	module.exports = Layer

	function Layer(path, options, fn) {
	  if (!(this instanceof Layer)) {
	    return new Layer(path, options, fn)
	  }

	  debug('new %s', path)
	  options = options || {}

	  this.handle = fn
	  this.name = fn.name || '<anonymous>'
	  this.params = undefined
	  this.path = undefined
	  this.regexp = pathRegexp(path, this.keys = [], options)

	  if (path === '/' && options.end === false) {
	    this.regexp.fast_slash = true
	  }
	}

	/**
	 * Handle the error for the layer.
	 *
	 * @param {Error} error
	 * @param {Request} req
	 * @param {Response} res
	 * @param {function} next
	 * @api private
	 */

	Layer.prototype.handle_error = function handle_error(error, req, res, next) {
	  var fn = this.handle

	  if (fn.length !== 4) {
	    // not a standard error handler
	    return next(error)
	  }

	  try {
	    fn(error, req, res, next)
	  } catch (err) {
	    next(err)
	  }
	}

	/**
	 * Handle the request for the layer.
	 *
	 * @param {Request} req
	 * @param {Response} res
	 * @param {function} next
	 * @api private
	 */

	Layer.prototype.handle_request = function handle(req, res, next) {
	  var fn = this.handle

	  if (fn.length > 3) {
	    // not a standard request handler
	    return next()
	  }

	  try {
	    fn(req, res, next)
	  } catch (err) {
	    next(err)
	  }
	}

	/**
	 * Check if this route matches `path`, if so
	 * populate `.params`.
	 *
	 * @param {String} path
	 * @return {Boolean}
	 * @api private
	 */

	Layer.prototype.match = function match(path) {
	  if (path == null) {
	    // no path, nothing matches
	    this.params = undefined
	    this.path = undefined
	    return false
	  }

	  if (this.regexp.fast_slash) {
	    // fast path non-ending match for / (everything matches)
	    this.params = {}
	    this.path = ''
	    return true
	  }

	  var m = this.regexp.exec(path)

	  if (!m) {
	    this.params = undefined
	    this.path = undefined
	    return false
	  }

	  // store values
	  this.params = {}
	  this.path = m[0]

	  var keys = this.keys
	  var params = this.params
	  var prop
	  var n = 0
	  var key
	  var val

	  for (var i = 1, len = m.length; i < len; ++i) {
	    key = keys[i - 1]
	    prop = key
	      ? key.name
	      : n++
	    val = decode_param(m[i])

	    if (val !== undefined || !(hasOwnProperty.call(params, prop))) {
	      params[prop] = val
	    }
	  }

	  return true
	}

	/**
	 * Decode param value.
	 *
	 * @param {string} val
	 * @return {string}
	 * @api private
	 */

	function decode_param(val){
	  if (typeof val !== 'string') {
	    return val
	  }

	  try {
	    return decodeURIComponent(val)
	  } catch (e) {
	    var err = new TypeError("Failed to decode param '" + val + "'")
	    err.status = 400
	    throw err
	  }
	}


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * router
	 * Copyright(c) 2013 Roman Shtylman
	 * Copyright(c) 2014 Douglas Christopher Wilson
	 * MIT Licensed
	 */

	/**
	 * Module dependencies.
	 * @private
	 */

	var debug = __webpack_require__(2)('router:route')
	var flatten = __webpack_require__(20)
	var Layer = __webpack_require__(10)
	var methods = __webpack_require__(14)

	/**
	 * Module variables.
	 * @private
	 */

	var slice = Array.prototype.slice

	/**
	 * Expose `Route`.
	 */

	module.exports = Route

	/**
	 * Initialize `Route` with the given `path`,
	 *
	 * @param {String} path
	 * @api private
	 */

	function Route(path) {
	  debug('new %s', path)
	  this.path = path
	  this.stack = []

	  // route handlers for various http methods
	  this.methods = {}
	}

	/**
	 * @private
	 */

	Route.prototype._handles_method = function _handles_method(method) {
	  if (this.methods._all) {
	    return true
	  }

	  method = method.toLowerCase()

	  if (method === 'head' && !this.methods['head']) {
	    method = 'get'
	  }

	  return Boolean(this.methods[method])
	}

	/**
	 * @return {array} supported HTTP methods
	 * @private
	 */

	Route.prototype._methods = function _methods() {
	  var methods = Object.keys(this.methods)

	  // append automatic head
	  if (this.methods.get && !this.methods.head) {
	    methods.push('head')
	  }

	  for (var i = 0; i < methods.length; i++) {
	    // make upper case
	    methods[i] = methods[i].toUpperCase()
	  }

	  return methods
	}

	/**
	 * dispatch req, res into this route
	 *
	 * @private
	 */

	Route.prototype.dispatch = function dispatch(req, res, done) {
	  var idx = 0
	  var stack = this.stack
	  if (stack.length === 0) {
	    return done()
	  }

	  var method = req.method.toLowerCase()
	  if (method === 'head' && !this.methods['head']) {
	    method = 'get'
	  }

	  req.route = this

	  next()

	  function next(err) {
	    if (err && err === 'route') {
	      return done()
	    }

	    // no more matching layers
	    if (idx >= stack.length) {
	      return done(err)
	    }

	    var layer
	    var match

	    // find next matching layer
	    while (match !== true && idx < stack.length) {
	      layer = stack[idx++]
	      match = !layer.method || layer.method === method
	    }

	    // no match
	    if (match !== true) {
	      return done(err)
	    }

	    if (err) {
	      layer.handle_error(err, req, res, next)
	    } else {
	      layer.handle_request(req, res, next)
	    }
	  }
	}

	/**
	 * Add a handler for all HTTP verbs to this route.
	 *
	 * Behaves just like middleware and can respond or call `next`
	 * to continue processing.
	 *
	 * You can use multiple `.all` call to add multiple handlers.
	 *
	 *   function check_something(req, res, next){
	 *     next()
	 *   }
	 *
	 *   function validate_user(req, res, next){
	 *     next()
	 *   }
	 *
	 *   route
	 *   .all(validate_user)
	 *   .all(check_something)
	 *   .get(function(req, res, next){
	 *     res.send('hello world')
	 *   })
	 *
	 * @param {array|function} handler
	 * @return {Route} for chaining
	 * @api public
	 */

	Route.prototype.all = function all(handler) {
	  var callbacks = flatten(slice.call(arguments))

	  if (callbacks.length === 0) {
	    throw new TypeError('argument handler is required')
	  }

	  callbacks.forEach(function (fn) {
	    if (typeof fn !== 'function') {
	      throw new TypeError('argument handler must be a function')
	    }

	    var layer = Layer('/', {}, fn)
	    layer.method = undefined

	    this.methods._all = true
	    this.stack.push(layer)
	  }, this)

	  return this
	}

	methods.forEach(function (method) {
	  Route.prototype[method] = function (handler) {
	    var callbacks = flatten(slice.call(arguments))

	    if (callbacks.length === 0) {
	      throw new TypeError('argument handler is required')
	    }

	    callbacks.forEach(function (fn) {
	      if (typeof fn !== 'function') {
	        throw new TypeError('argument handler must be a function')
	      }

	      debug('%s %s', method, this.path)

	      var layer = Layer('/', {}, fn)
	      layer.method = method

	      this.methods[method] = true
	      this.stack.push(layer)
	    }, this)

	    return this
	  }
	})


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, clearImmediate) {var nextTick = __webpack_require__(24).nextTick;
	var slice = Array.prototype.slice;
	var immediateIds = {};
	var nextImmediateId = 0;

	// DOM APIs, for completeness

	if (typeof setTimeout !== 'undefined') exports.setTimeout = function() { return setTimeout.apply(window, arguments); };
	if (typeof clearTimeout !== 'undefined') exports.clearTimeout = function() { clearTimeout.apply(window, arguments); };
	if (typeof setInterval !== 'undefined') exports.setInterval = function() { return setInterval.apply(window, arguments); };
	if (typeof clearInterval !== 'undefined') exports.clearInterval = function() { clearInterval.apply(window, arguments); };

	// TODO: Change to more efficient list approach used in Node.js
	// For now, we just implement the APIs using the primitives above.

	exports.enroll = function(item, delay) {
	  item._timeoutID = setTimeout(item._onTimeout, delay);
	};

	exports.unenroll = function(item) {
	  clearTimeout(item._timeoutID);
	};

	exports.active = function(item) {
	  // our naive impl doesn't care (correctness is still preserved)
	};

	// That's not how node.js implements it but the exposed api is the same.
	exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
	  var id = nextImmediateId++;
	  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

	  immediateIds[id] = true;

	  nextTick(function onNextTick() {
	    if (immediateIds[id]) {
	      // fn.call() is faster so we optimize for the common use-case
	      // @see http://jsperf.com/call-apply-segu
	      if (args) {
	        fn.apply(null, args);
	      } else {
	        fn.call(null);
	      }
	      // Prevent ids from leaking
	      exports.clearImmediate(id);
	    }
	  });

	  return id;
	};

	exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
	  delete immediateIds[id];
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12).setImmediate, __webpack_require__(12).clearImmediate))

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	// shim for using process in browser

	var process = module.exports = {};

	process.nextTick = (function () {
	    var canSetImmediate = typeof window !== 'undefined'
	    && window.setImmediate;
	    var canMutationObserver = typeof window !== 'undefined'
	    && window.MutationObserver;
	    var canPost = typeof window !== 'undefined'
	    && window.postMessage && window.addEventListener
	    ;

	    if (canSetImmediate) {
	        return function (f) { return window.setImmediate(f) };
	    }

	    var queue = [];

	    if (canMutationObserver) {
	        var hiddenDiv = document.createElement("div");
	        var observer = new MutationObserver(function () {
	            var queueList = queue.slice();
	            queue.length = 0;
	            queueList.forEach(function (fn) {
	                fn();
	            });
	        });

	        observer.observe(hiddenDiv, { attributes: true });

	        return function nextTick(fn) {
	            if (!queue.length) {
	                hiddenDiv.setAttribute('yes', 'no');
	            }
	            queue.push(fn);
	        };
	    }

	    if (canPost) {
	        window.addEventListener('message', function (ev) {
	            var source = ev.source;
	            if ((source === window || source === null) && ev.data === 'process-tick') {
	                ev.stopPropagation();
	                if (queue.length > 0) {
	                    var fn = queue.shift();
	                    fn();
	                }
	            }
	        }, true);

	        return function nextTick(fn) {
	            queue.push(fn);
	            window.postMessage('process-tick', '*');
	        };
	    }

	    return function nextTick(fn) {
	        setTimeout(fn, 0);
	    };
	})();

	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	// TODO(shtylman)
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	
	var http = __webpack_require__(21);

	/* istanbul ignore next: implementation differs on version */
	if (http.METHODS) {

	  module.exports = http.METHODS.map(function(method){
	    return method.toLowerCase();
	  });

	} else {

	  module.exports = [
	    'get',
	    'post',
	    'put',
	    'head',
	    'delete',
	    'options',
	    'trace',
	    'copy',
	    'lock',
	    'mkcol',
	    'move',
	    'purge',
	    'propfind',
	    'proppatch',
	    'unlock',
	    'report',
	    'mkactivity',
	    'checkout',
	    'merge',
	    'm-search',
	    'notify',
	    'subscribe',
	    'unsubscribe',
	    'patch',
	    'search',
	    'connect'
	  ];

	}


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Merge object b with object a.
	 *
	 *     var a = { foo: 'bar' }
	 *       , b = { bar: 'baz' };
	 *
	 *     merge(a, b);
	 *     // => { foo: 'bar', bar: 'baz' }
	 *
	 * @param {Object} a
	 * @param {Object} b
	 * @return {Object}
	 * @api public
	 */

	exports = module.exports = function(a, b){
	  if (a && b) {
	    for (var key in b) {
	      a[key] = b[key];
	    }
	  }
	  return a;
	};


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * parseurl
	 * Copyright(c) 2014 Jonathan Ong
	 * Copyright(c) 2014 Douglas Christopher Wilson
	 * MIT Licensed
	 */

	/**
	 * Module dependencies.
	 */

	var url = __webpack_require__(23)
	var parse = url.parse
	var Url = url.Url

	/**
	 * Pattern for a simple path case.
	 * See: https://github.com/joyent/node/pull/7878
	 */

	var simplePathRegExp = /^(\/\/?(?!\/)[^\?#\s]*)(\?[^#\s]*)?$/

	/**
	 * Exports.
	 */

	module.exports = parseurl
	module.exports.original = originalurl

	/**
	 * Parse the `req` url with memoization.
	 *
	 * @param {ServerRequest} req
	 * @return {Object}
	 * @api public
	 */

	function parseurl(req) {
	  var url = req.url

	  if (url === undefined) {
	    // URL is undefined
	    return undefined
	  }

	  var parsed = req._parsedUrl

	  if (fresh(url, parsed)) {
	    // Return cached URL parse
	    return parsed
	  }

	  // Parse the URL
	  parsed = fastparse(url)
	  parsed._raw = url

	  return req._parsedUrl = parsed
	};

	/**
	 * Parse the `req` original url with fallback and memoization.
	 *
	 * @param {ServerRequest} req
	 * @return {Object}
	 * @api public
	 */

	function originalurl(req) {
	  var url = req.originalUrl

	  if (typeof url !== 'string') {
	    // Fallback
	    return parseurl(req)
	  }

	  var parsed = req._parsedOriginalUrl

	  if (fresh(url, parsed)) {
	    // Return cached URL parse
	    return parsed
	  }

	  // Parse the URL
	  parsed = fastparse(url)
	  parsed._raw = url

	  return req._parsedOriginalUrl = parsed
	};

	/**
	 * Parse the `str` url with fast-path short-cut.
	 *
	 * @param {string} str
	 * @return {Object}
	 * @api private
	 */

	function fastparse(str) {
	  // Try fast path regexp
	  // See: https://github.com/joyent/node/pull/7878
	  var simplePath = typeof str === 'string' && simplePathRegExp.exec(str)

	  // Construct simple URL
	  if (simplePath) {
	    var pathname = simplePath[1]
	    var search = simplePath[2] || null
	    var url = Url !== undefined
	      ? new Url()
	      : {}
	    url.path = str
	    url.href = str
	    url.pathname = pathname
	    url.search = search
	    url.query = search && search.substr(1)

	    return url
	  }

	  return parse(str)
	}

	/**
	 * Determine if parsed is still fresh for url.
	 *
	 * @param {string} url
	 * @param {object} parsedUrl
	 * @return {boolean}
	 * @api private
	 */

	function fresh(url, parsedUrl) {
	  return typeof parsedUrl === 'object'
	    && parsedUrl !== null
	    && (Url === undefined || parsedUrl instanceof Url)
	    && parsedUrl._raw === url
	}


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	'use strict';

	// If obj.hasOwnProperty has been overridden, then calling
	// obj.hasOwnProperty(prop) will break.
	// See: https://github.com/joyent/node/issues/1707
	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	module.exports = function(qs, sep, eq, options) {
	  sep = sep || '&';
	  eq = eq || '=';
	  var obj = {};

	  if (typeof qs !== 'string' || qs.length === 0) {
	    return obj;
	  }

	  var regexp = /\+/g;
	  qs = qs.split(sep);

	  var maxKeys = 1000;
	  if (options && typeof options.maxKeys === 'number') {
	    maxKeys = options.maxKeys;
	  }

	  var len = qs.length;
	  // maxKeys <= 0 means that we should not limit keys count
	  if (maxKeys > 0 && len > maxKeys) {
	    len = maxKeys;
	  }

	  for (var i = 0; i < len; ++i) {
	    var x = qs[i].replace(regexp, '%20'),
	        idx = x.indexOf(eq),
	        kstr, vstr, k, v;

	    if (idx >= 0) {
	      kstr = x.substr(0, idx);
	      vstr = x.substr(idx + 1);
	    } else {
	      kstr = x;
	      vstr = '';
	    }

	    k = decodeURIComponent(kstr);
	    v = decodeURIComponent(vstr);

	    if (!hasOwnProperty(obj, k)) {
	      obj[k] = v;
	    } else if (isArray(obj[k])) {
	      obj[k].push(v);
	    } else {
	      obj[k] = [obj[k], v];
	    }
	  }

	  return obj;
	};

	var isArray = Array.isArray || function (xs) {
	  return Object.prototype.toString.call(xs) === '[object Array]';
	};


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	'use strict';

	var stringifyPrimitive = function(v) {
	  switch (typeof v) {
	    case 'string':
	      return v;

	    case 'boolean':
	      return v ? 'true' : 'false';

	    case 'number':
	      return isFinite(v) ? v : '';

	    default:
	      return '';
	  }
	};

	module.exports = function(obj, sep, eq, name) {
	  sep = sep || '&';
	  eq = eq || '=';
	  if (obj === null) {
	    obj = undefined;
	  }

	  if (typeof obj === 'object') {
	    return map(objectKeys(obj), function(k) {
	      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
	      if (isArray(obj[k])) {
	        return map(obj[k], function(v) {
	          return ks + encodeURIComponent(stringifyPrimitive(v));
	        }).join(sep);
	      } else {
	        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
	      }
	    }).join(sep);

	  }

	  if (!name) return '';
	  return encodeURIComponent(stringifyPrimitive(name)) + eq +
	         encodeURIComponent(stringifyPrimitive(obj));
	};

	var isArray = Array.isArray || function (xs) {
	  return Object.prototype.toString.call(xs) === '[object Array]';
	};

	function map (xs, f) {
	  if (xs.map) return xs.map(f);
	  var res = [];
	  for (var i = 0; i < xs.length; i++) {
	    res.push(f(xs[i], i));
	  }
	  return res;
	}

	var objectKeys = Object.keys || function (obj) {
	  var res = [];
	  for (var key in obj) {
	    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
	  }
	  return res;
	};


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Helpers.
	 */

	var s = 1000;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var y = d * 365.25;

	/**
	 * Parse or format the given `val`.
	 *
	 * Options:
	 *
	 *  - `long` verbose formatting [false]
	 *
	 * @param {String|Number} val
	 * @param {Object} options
	 * @return {String|Number}
	 * @api public
	 */

	module.exports = function(val, options){
	  options = options || {};
	  if ('string' == typeof val) return parse(val);
	  return options.long
	    ? long(val)
	    : short(val);
	};

	/**
	 * Parse the given `str` and return milliseconds.
	 *
	 * @param {String} str
	 * @return {Number}
	 * @api private
	 */

	function parse(str) {
	  var match = /^((?:\d+)?\.?\d+) *(ms|seconds?|s|minutes?|m|hours?|h|days?|d|years?|y)?$/i.exec(str);
	  if (!match) return;
	  var n = parseFloat(match[1]);
	  var type = (match[2] || 'ms').toLowerCase();
	  switch (type) {
	    case 'years':
	    case 'year':
	    case 'y':
	      return n * y;
	    case 'days':
	    case 'day':
	    case 'd':
	      return n * d;
	    case 'hours':
	    case 'hour':
	    case 'h':
	      return n * h;
	    case 'minutes':
	    case 'minute':
	    case 'm':
	      return n * m;
	    case 'seconds':
	    case 'second':
	    case 's':
	      return n * s;
	    case 'ms':
	      return n;
	  }
	}

	/**
	 * Short format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function short(ms) {
	  if (ms >= d) return Math.round(ms / d) + 'd';
	  if (ms >= h) return Math.round(ms / h) + 'h';
	  if (ms >= m) return Math.round(ms / m) + 'm';
	  if (ms >= s) return Math.round(ms / s) + 's';
	  return ms + 'ms';
	}

	/**
	 * Long format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function long(ms) {
	  return plural(ms, d, 'day')
	    || plural(ms, h, 'hour')
	    || plural(ms, m, 'minute')
	    || plural(ms, s, 'second')
	    || ms + ' ms';
	}

	/**
	 * Pluralization helper.
	 */

	function plural(ms, n, name) {
	  if (ms < n) return;
	  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
	  return Math.ceil(ms / n) + ' ' + name + 's';
	}


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Recursive flatten function. Fastest implementation for array flattening.
	 *
	 * @param  {Array}  array
	 * @param  {Array}  result
	 * @param  {Number} depth
	 * @return {Array}
	 */
	function flatten (array, result, depth) {
	  for (var i = 0; i < array.length; i++) {
	    if (depth > 0 && Array.isArray(array[i])) {
	      flatten(array[i], result, depth - 1);
	    } else {
	      result.push(array[i]);
	    }
	  }

	  return result;
	}

	/**
	 * Flatten an array, with the ability to define a depth.
	 *
	 * @param  {Array}  array
	 * @param  {Number} depth
	 * @return {Array}
	 */
	module.exports = function (array, depth) {
	  return flatten(array, [], depth || Infinity);
	};


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/* (ignored) */

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Expose `pathtoRegexp`.
	 */

	module.exports = pathtoRegexp;

	/**
	 * Normalize the given path string,
	 * returning a regular expression.
	 *
	 * An empty array should be passed,
	 * which will contain the placeholder
	 * key names. For example "/user/:id" will
	 * then contain ["id"].
	 *
	 * @param  {String|RegExp|Array} path
	 * @param  {Array} keys
	 * @param  {Object} options
	 * @return {RegExp}
	 * @api private
	 */

	function pathtoRegexp(path, keys, options) {
	  options = options || {};
	  var strict = options.strict;
	  var end = options.end !== false;
	  var flags = options.sensitive ? '' : 'i';
	  keys = keys || [];

	  if (path instanceof RegExp) {
	    return path;
	  }

	  if (Array.isArray(path)) {
	    // Map array parts into regexps and return their source. We also pass
	    // the same keys and options instance into every generation to get
	    // consistent matching groups before we join the sources together.
	    path = path.map(function (value) {
	      return pathtoRegexp(value, keys, options).source;
	    });

	    return new RegExp('(?:' + path.join('|') + ')', flags);
	  }

	  path = ('^' + path + (strict ? '' : path[path.length - 1] === '/' ? '?' : '/?'))
	    .replace(/\/\(/g, '/(?:')
	    .replace(/([\/\.])/g, '\\$1')
	    .replace(/(\\\/)?(\\\.)?:(\w+)(\(.*?\))?(\*)?(\?)?/g, function (match, slash, format, key, capture, star, optional) {
	      slash = slash || '';
	      format = format || '';
	      capture = capture || '([^\\/' + format + ']+?)';
	      optional = optional || '';

	      keys.push({ name: key, optional: !!optional });

	      return ''
	        + (optional ? '' : slash)
	        + '(?:'
	        + format + (optional ? slash : '') + capture
	        + (star ? '((?:[\\/' + format + '].+?)?)' : '')
	        + ')'
	        + optional;
	    })
	    .replace(/\*/g, '(.*)');

	  // If the path is non-ending, match until the end or a slash.
	  path += (end ? '$' : (path[path.length - 1] === '/' ? '' : '(?=\\/|$)'));

	  return new RegExp(path, flags);
	};


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	var punycode = __webpack_require__(25);

	exports.parse = urlParse;
	exports.resolve = urlResolve;
	exports.resolveObject = urlResolveObject;
	exports.format = urlFormat;

	exports.Url = Url;

	function Url() {
	  this.protocol = null;
	  this.slashes = null;
	  this.auth = null;
	  this.host = null;
	  this.port = null;
	  this.hostname = null;
	  this.hash = null;
	  this.search = null;
	  this.query = null;
	  this.pathname = null;
	  this.path = null;
	  this.href = null;
	}

	// Reference: RFC 3986, RFC 1808, RFC 2396

	// define these here so at least they only have to be
	// compiled once on the first module load.
	var protocolPattern = /^([a-z0-9.+-]+:)/i,
	    portPattern = /:[0-9]*$/,

	    // RFC 2396: characters reserved for delimiting URLs.
	    // We actually just auto-escape these.
	    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

	    // RFC 2396: characters not allowed for various reasons.
	    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

	    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
	    autoEscape = ['\''].concat(unwise),
	    // Characters that are never ever allowed in a hostname.
	    // Note that any invalid chars are also handled, but these
	    // are the ones that are *expected* to be seen, so we fast-path
	    // them.
	    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
	    hostEndingChars = ['/', '?', '#'],
	    hostnameMaxLen = 255,
	    hostnamePartPattern = /^[a-z0-9A-Z_-]{0,63}$/,
	    hostnamePartStart = /^([a-z0-9A-Z_-]{0,63})(.*)$/,
	    // protocols that can allow "unsafe" and "unwise" chars.
	    unsafeProtocol = {
	      'javascript': true,
	      'javascript:': true
	    },
	    // protocols that never have a hostname.
	    hostlessProtocol = {
	      'javascript': true,
	      'javascript:': true
	    },
	    // protocols that always contain a // bit.
	    slashedProtocol = {
	      'http': true,
	      'https': true,
	      'ftp': true,
	      'gopher': true,
	      'file': true,
	      'http:': true,
	      'https:': true,
	      'ftp:': true,
	      'gopher:': true,
	      'file:': true
	    },
	    querystring = __webpack_require__(9);

	function urlParse(url, parseQueryString, slashesDenoteHost) {
	  if (url && isObject(url) && url instanceof Url) return url;

	  var u = new Url;
	  u.parse(url, parseQueryString, slashesDenoteHost);
	  return u;
	}

	Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
	  if (!isString(url)) {
	    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
	  }

	  var rest = url;

	  // trim before proceeding.
	  // This is to support parse stuff like "  http://foo.com  \n"
	  rest = rest.trim();

	  var proto = protocolPattern.exec(rest);
	  if (proto) {
	    proto = proto[0];
	    var lowerProto = proto.toLowerCase();
	    this.protocol = lowerProto;
	    rest = rest.substr(proto.length);
	  }

	  // figure out if it's got a host
	  // user@server is *always* interpreted as a hostname, and url
	  // resolution will treat //foo/bar as host=foo,path=bar because that's
	  // how the browser resolves relative URLs.
	  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
	    var slashes = rest.substr(0, 2) === '//';
	    if (slashes && !(proto && hostlessProtocol[proto])) {
	      rest = rest.substr(2);
	      this.slashes = true;
	    }
	  }

	  if (!hostlessProtocol[proto] &&
	      (slashes || (proto && !slashedProtocol[proto]))) {

	    // there's a hostname.
	    // the first instance of /, ?, ;, or # ends the host.
	    //
	    // If there is an @ in the hostname, then non-host chars *are* allowed
	    // to the left of the last @ sign, unless some host-ending character
	    // comes *before* the @-sign.
	    // URLs are obnoxious.
	    //
	    // ex:
	    // http://a@b@c/ => user:a@b host:c
	    // http://a@b?@c => user:a host:c path:/?@c

	    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
	    // Review our test case against browsers more comprehensively.

	    // find the first instance of any hostEndingChars
	    var hostEnd = -1;
	    for (var i = 0; i < hostEndingChars.length; i++) {
	      var hec = rest.indexOf(hostEndingChars[i]);
	      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
	        hostEnd = hec;
	    }

	    // at this point, either we have an explicit point where the
	    // auth portion cannot go past, or the last @ char is the decider.
	    var auth, atSign;
	    if (hostEnd === -1) {
	      // atSign can be anywhere.
	      atSign = rest.lastIndexOf('@');
	    } else {
	      // atSign must be in auth portion.
	      // http://a@b/c@d => host:b auth:a path:/c@d
	      atSign = rest.lastIndexOf('@', hostEnd);
	    }

	    // Now we have a portion which is definitely the auth.
	    // Pull that off.
	    if (atSign !== -1) {
	      auth = rest.slice(0, atSign);
	      rest = rest.slice(atSign + 1);
	      this.auth = decodeURIComponent(auth);
	    }

	    // the host is the remaining to the left of the first non-host char
	    hostEnd = -1;
	    for (var i = 0; i < nonHostChars.length; i++) {
	      var hec = rest.indexOf(nonHostChars[i]);
	      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
	        hostEnd = hec;
	    }
	    // if we still have not hit it, then the entire thing is a host.
	    if (hostEnd === -1)
	      hostEnd = rest.length;

	    this.host = rest.slice(0, hostEnd);
	    rest = rest.slice(hostEnd);

	    // pull out port.
	    this.parseHost();

	    // we've indicated that there is a hostname,
	    // so even if it's empty, it has to be present.
	    this.hostname = this.hostname || '';

	    // if hostname begins with [ and ends with ]
	    // assume that it's an IPv6 address.
	    var ipv6Hostname = this.hostname[0] === '[' &&
	        this.hostname[this.hostname.length - 1] === ']';

	    // validate a little.
	    if (!ipv6Hostname) {
	      var hostparts = this.hostname.split(/\./);
	      for (var i = 0, l = hostparts.length; i < l; i++) {
	        var part = hostparts[i];
	        if (!part) continue;
	        if (!part.match(hostnamePartPattern)) {
	          var newpart = '';
	          for (var j = 0, k = part.length; j < k; j++) {
	            if (part.charCodeAt(j) > 127) {
	              // we replace non-ASCII char with a temporary placeholder
	              // we need this to make sure size of hostname is not
	              // broken by replacing non-ASCII by nothing
	              newpart += 'x';
	            } else {
	              newpart += part[j];
	            }
	          }
	          // we test again with ASCII char only
	          if (!newpart.match(hostnamePartPattern)) {
	            var validParts = hostparts.slice(0, i);
	            var notHost = hostparts.slice(i + 1);
	            var bit = part.match(hostnamePartStart);
	            if (bit) {
	              validParts.push(bit[1]);
	              notHost.unshift(bit[2]);
	            }
	            if (notHost.length) {
	              rest = '/' + notHost.join('.') + rest;
	            }
	            this.hostname = validParts.join('.');
	            break;
	          }
	        }
	      }
	    }

	    if (this.hostname.length > hostnameMaxLen) {
	      this.hostname = '';
	    } else {
	      // hostnames are always lower case.
	      this.hostname = this.hostname.toLowerCase();
	    }

	    if (!ipv6Hostname) {
	      // IDNA Support: Returns a puny coded representation of "domain".
	      // It only converts the part of the domain name that
	      // has non ASCII characters. I.e. it dosent matter if
	      // you call it with a domain that already is in ASCII.
	      var domainArray = this.hostname.split('.');
	      var newOut = [];
	      for (var i = 0; i < domainArray.length; ++i) {
	        var s = domainArray[i];
	        newOut.push(s.match(/[^A-Za-z0-9_-]/) ?
	            'xn--' + punycode.encode(s) : s);
	      }
	      this.hostname = newOut.join('.');
	    }

	    var p = this.port ? ':' + this.port : '';
	    var h = this.hostname || '';
	    this.host = h + p;
	    this.href += this.host;

	    // strip [ and ] from the hostname
	    // the host field still retains them, though
	    if (ipv6Hostname) {
	      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
	      if (rest[0] !== '/') {
	        rest = '/' + rest;
	      }
	    }
	  }

	  // now rest is set to the post-host stuff.
	  // chop off any delim chars.
	  if (!unsafeProtocol[lowerProto]) {

	    // First, make 100% sure that any "autoEscape" chars get
	    // escaped, even if encodeURIComponent doesn't think they
	    // need to be.
	    for (var i = 0, l = autoEscape.length; i < l; i++) {
	      var ae = autoEscape[i];
	      var esc = encodeURIComponent(ae);
	      if (esc === ae) {
	        esc = escape(ae);
	      }
	      rest = rest.split(ae).join(esc);
	    }
	  }


	  // chop off from the tail first.
	  var hash = rest.indexOf('#');
	  if (hash !== -1) {
	    // got a fragment string.
	    this.hash = rest.substr(hash);
	    rest = rest.slice(0, hash);
	  }
	  var qm = rest.indexOf('?');
	  if (qm !== -1) {
	    this.search = rest.substr(qm);
	    this.query = rest.substr(qm + 1);
	    if (parseQueryString) {
	      this.query = querystring.parse(this.query);
	    }
	    rest = rest.slice(0, qm);
	  } else if (parseQueryString) {
	    // no query string, but parseQueryString still requested
	    this.search = '';
	    this.query = {};
	  }
	  if (rest) this.pathname = rest;
	  if (slashedProtocol[lowerProto] &&
	      this.hostname && !this.pathname) {
	    this.pathname = '/';
	  }

	  //to support http.request
	  if (this.pathname || this.search) {
	    var p = this.pathname || '';
	    var s = this.search || '';
	    this.path = p + s;
	  }

	  // finally, reconstruct the href based on what has been validated.
	  this.href = this.format();
	  return this;
	};

	// format a parsed object into a url string
	function urlFormat(obj) {
	  // ensure it's an object, and not a string url.
	  // If it's an obj, this is a no-op.
	  // this way, you can call url_format() on strings
	  // to clean up potentially wonky urls.
	  if (isString(obj)) obj = urlParse(obj);
	  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
	  return obj.format();
	}

	Url.prototype.format = function() {
	  var auth = this.auth || '';
	  if (auth) {
	    auth = encodeURIComponent(auth);
	    auth = auth.replace(/%3A/i, ':');
	    auth += '@';
	  }

	  var protocol = this.protocol || '',
	      pathname = this.pathname || '',
	      hash = this.hash || '',
	      host = false,
	      query = '';

	  if (this.host) {
	    host = auth + this.host;
	  } else if (this.hostname) {
	    host = auth + (this.hostname.indexOf(':') === -1 ?
	        this.hostname :
	        '[' + this.hostname + ']');
	    if (this.port) {
	      host += ':' + this.port;
	    }
	  }

	  if (this.query &&
	      isObject(this.query) &&
	      Object.keys(this.query).length) {
	    query = querystring.stringify(this.query);
	  }

	  var search = this.search || (query && ('?' + query)) || '';

	  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

	  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
	  // unless they had them to begin with.
	  if (this.slashes ||
	      (!protocol || slashedProtocol[protocol]) && host !== false) {
	    host = '//' + (host || '');
	    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
	  } else if (!host) {
	    host = '';
	  }

	  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
	  if (search && search.charAt(0) !== '?') search = '?' + search;

	  pathname = pathname.replace(/[?#]/g, function(match) {
	    return encodeURIComponent(match);
	  });
	  search = search.replace('#', '%23');

	  return protocol + host + pathname + search + hash;
	};

	function urlResolve(source, relative) {
	  return urlParse(source, false, true).resolve(relative);
	}

	Url.prototype.resolve = function(relative) {
	  return this.resolveObject(urlParse(relative, false, true)).format();
	};

	function urlResolveObject(source, relative) {
	  if (!source) return relative;
	  return urlParse(source, false, true).resolveObject(relative);
	}

	Url.prototype.resolveObject = function(relative) {
	  if (isString(relative)) {
	    var rel = new Url();
	    rel.parse(relative, false, true);
	    relative = rel;
	  }

	  var result = new Url();
	  Object.keys(this).forEach(function(k) {
	    result[k] = this[k];
	  }, this);

	  // hash is always overridden, no matter what.
	  // even href="" will remove it.
	  result.hash = relative.hash;

	  // if the relative url is empty, then there's nothing left to do here.
	  if (relative.href === '') {
	    result.href = result.format();
	    return result;
	  }

	  // hrefs like //foo/bar always cut to the protocol.
	  if (relative.slashes && !relative.protocol) {
	    // take everything except the protocol from relative
	    Object.keys(relative).forEach(function(k) {
	      if (k !== 'protocol')
	        result[k] = relative[k];
	    });

	    //urlParse appends trailing / to urls like http://www.example.com
	    if (slashedProtocol[result.protocol] &&
	        result.hostname && !result.pathname) {
	      result.path = result.pathname = '/';
	    }

	    result.href = result.format();
	    return result;
	  }

	  if (relative.protocol && relative.protocol !== result.protocol) {
	    // if it's a known url protocol, then changing
	    // the protocol does weird things
	    // first, if it's not file:, then we MUST have a host,
	    // and if there was a path
	    // to begin with, then we MUST have a path.
	    // if it is file:, then the host is dropped,
	    // because that's known to be hostless.
	    // anything else is assumed to be absolute.
	    if (!slashedProtocol[relative.protocol]) {
	      Object.keys(relative).forEach(function(k) {
	        result[k] = relative[k];
	      });
	      result.href = result.format();
	      return result;
	    }

	    result.protocol = relative.protocol;
	    if (!relative.host && !hostlessProtocol[relative.protocol]) {
	      var relPath = (relative.pathname || '').split('/');
	      while (relPath.length && !(relative.host = relPath.shift()));
	      if (!relative.host) relative.host = '';
	      if (!relative.hostname) relative.hostname = '';
	      if (relPath[0] !== '') relPath.unshift('');
	      if (relPath.length < 2) relPath.unshift('');
	      result.pathname = relPath.join('/');
	    } else {
	      result.pathname = relative.pathname;
	    }
	    result.search = relative.search;
	    result.query = relative.query;
	    result.host = relative.host || '';
	    result.auth = relative.auth;
	    result.hostname = relative.hostname || relative.host;
	    result.port = relative.port;
	    // to support http.request
	    if (result.pathname || result.search) {
	      var p = result.pathname || '';
	      var s = result.search || '';
	      result.path = p + s;
	    }
	    result.slashes = result.slashes || relative.slashes;
	    result.href = result.format();
	    return result;
	  }

	  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
	      isRelAbs = (
	          relative.host ||
	          relative.pathname && relative.pathname.charAt(0) === '/'
	      ),
	      mustEndAbs = (isRelAbs || isSourceAbs ||
	                    (result.host && relative.pathname)),
	      removeAllDots = mustEndAbs,
	      srcPath = result.pathname && result.pathname.split('/') || [],
	      relPath = relative.pathname && relative.pathname.split('/') || [],
	      psychotic = result.protocol && !slashedProtocol[result.protocol];

	  // if the url is a non-slashed url, then relative
	  // links like ../.. should be able
	  // to crawl up to the hostname, as well.  This is strange.
	  // result.protocol has already been set by now.
	  // Later on, put the first path part into the host field.
	  if (psychotic) {
	    result.hostname = '';
	    result.port = null;
	    if (result.host) {
	      if (srcPath[0] === '') srcPath[0] = result.host;
	      else srcPath.unshift(result.host);
	    }
	    result.host = '';
	    if (relative.protocol) {
	      relative.hostname = null;
	      relative.port = null;
	      if (relative.host) {
	        if (relPath[0] === '') relPath[0] = relative.host;
	        else relPath.unshift(relative.host);
	      }
	      relative.host = null;
	    }
	    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
	  }

	  if (isRelAbs) {
	    // it's absolute.
	    result.host = (relative.host || relative.host === '') ?
	                  relative.host : result.host;
	    result.hostname = (relative.hostname || relative.hostname === '') ?
	                      relative.hostname : result.hostname;
	    result.search = relative.search;
	    result.query = relative.query;
	    srcPath = relPath;
	    // fall through to the dot-handling below.
	  } else if (relPath.length) {
	    // it's relative
	    // throw away the existing file, and take the new path instead.
	    if (!srcPath) srcPath = [];
	    srcPath.pop();
	    srcPath = srcPath.concat(relPath);
	    result.search = relative.search;
	    result.query = relative.query;
	  } else if (!isNullOrUndefined(relative.search)) {
	    // just pull out the search.
	    // like href='?foo'.
	    // Put this after the other two cases because it simplifies the booleans
	    if (psychotic) {
	      result.hostname = result.host = srcPath.shift();
	      //occationaly the auth can get stuck only in host
	      //this especialy happens in cases like
	      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
	      var authInHost = result.host && result.host.indexOf('@') > 0 ?
	                       result.host.split('@') : false;
	      if (authInHost) {
	        result.auth = authInHost.shift();
	        result.host = result.hostname = authInHost.shift();
	      }
	    }
	    result.search = relative.search;
	    result.query = relative.query;
	    //to support http.request
	    if (!isNull(result.pathname) || !isNull(result.search)) {
	      result.path = (result.pathname ? result.pathname : '') +
	                    (result.search ? result.search : '');
	    }
	    result.href = result.format();
	    return result;
	  }

	  if (!srcPath.length) {
	    // no path at all.  easy.
	    // we've already handled the other stuff above.
	    result.pathname = null;
	    //to support http.request
	    if (result.search) {
	      result.path = '/' + result.search;
	    } else {
	      result.path = null;
	    }
	    result.href = result.format();
	    return result;
	  }

	  // if a url ENDs in . or .., then it must get a trailing slash.
	  // however, if it ends in anything else non-slashy,
	  // then it must NOT get a trailing slash.
	  var last = srcPath.slice(-1)[0];
	  var hasTrailingSlash = (
	      (result.host || relative.host) && (last === '.' || last === '..') ||
	      last === '');

	  // strip single dots, resolve double dots to parent dir
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = srcPath.length; i >= 0; i--) {
	    last = srcPath[i];
	    if (last == '.') {
	      srcPath.splice(i, 1);
	    } else if (last === '..') {
	      srcPath.splice(i, 1);
	      up++;
	    } else if (up) {
	      srcPath.splice(i, 1);
	      up--;
	    }
	  }

	  // if the path is allowed to go above the root, restore leading ..s
	  if (!mustEndAbs && !removeAllDots) {
	    for (; up--; up) {
	      srcPath.unshift('..');
	    }
	  }

	  if (mustEndAbs && srcPath[0] !== '' &&
	      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
	    srcPath.unshift('');
	  }

	  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
	    srcPath.push('');
	  }

	  var isAbsolute = srcPath[0] === '' ||
	      (srcPath[0] && srcPath[0].charAt(0) === '/');

	  // put the host back
	  if (psychotic) {
	    result.hostname = result.host = isAbsolute ? '' :
	                                    srcPath.length ? srcPath.shift() : '';
	    //occationaly the auth can get stuck only in host
	    //this especialy happens in cases like
	    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
	    var authInHost = result.host && result.host.indexOf('@') > 0 ?
	                     result.host.split('@') : false;
	    if (authInHost) {
	      result.auth = authInHost.shift();
	      result.host = result.hostname = authInHost.shift();
	    }
	  }

	  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

	  if (mustEndAbs && !isAbsolute) {
	    srcPath.unshift('');
	  }

	  if (!srcPath.length) {
	    result.pathname = null;
	    result.path = null;
	  } else {
	    result.pathname = srcPath.join('/');
	  }

	  //to support request.http
	  if (!isNull(result.pathname) || !isNull(result.search)) {
	    result.path = (result.pathname ? result.pathname : '') +
	                  (result.search ? result.search : '');
	  }
	  result.auth = relative.auth || result.auth;
	  result.slashes = result.slashes || relative.slashes;
	  result.href = result.format();
	  return result;
	};

	Url.prototype.parseHost = function() {
	  var host = this.host;
	  var port = portPattern.exec(host);
	  if (port) {
	    port = port[0];
	    if (port !== ':') {
	      this.port = port.substr(1);
	    }
	    host = host.substr(0, host.length - port.length);
	  }
	  if (host) this.hostname = host;
	};

	function isString(arg) {
	  return typeof arg === "string";
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isNull(arg) {
	  return arg === null;
	}
	function isNullOrUndefined(arg) {
	  return  arg == null;
	}


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    draining = true;
	    var currentQueue;
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        var i = -1;
	        while (++i < len) {
	            currentQueue[i]();
	        }
	        len = queue.length;
	    }
	    draining = false;
	}
	process.nextTick = function (fun) {
	    queue.push(fun);
	    if (!draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	// TODO(shtylman)
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {/*! https://mths.be/punycode v1.3.2 by @mathias */
	;(function(root) {

		/** Detect free variables */
		var freeExports = typeof exports == 'object' && exports &&
			!exports.nodeType && exports;
		var freeModule = typeof module == 'object' && module &&
			!module.nodeType && module;
		var freeGlobal = typeof global == 'object' && global;
		if (
			freeGlobal.global === freeGlobal ||
			freeGlobal.window === freeGlobal ||
			freeGlobal.self === freeGlobal
		) {
			root = freeGlobal;
		}

		/**
		 * The `punycode` object.
		 * @name punycode
		 * @type Object
		 */
		var punycode,

		/** Highest positive signed 32-bit float value */
		maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

		/** Bootstring parameters */
		base = 36,
		tMin = 1,
		tMax = 26,
		skew = 38,
		damp = 700,
		initialBias = 72,
		initialN = 128, // 0x80
		delimiter = '-', // '\x2D'

		/** Regular expressions */
		regexPunycode = /^xn--/,
		regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
		regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

		/** Error messages */
		errors = {
			'overflow': 'Overflow: input needs wider integers to process',
			'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
			'invalid-input': 'Invalid input'
		},

		/** Convenience shortcuts */
		baseMinusTMin = base - tMin,
		floor = Math.floor,
		stringFromCharCode = String.fromCharCode,

		/** Temporary variable */
		key;

		/*--------------------------------------------------------------------------*/

		/**
		 * A generic error utility function.
		 * @private
		 * @param {String} type The error type.
		 * @returns {Error} Throws a `RangeError` with the applicable error message.
		 */
		function error(type) {
			throw RangeError(errors[type]);
		}

		/**
		 * A generic `Array#map` utility function.
		 * @private
		 * @param {Array} array The array to iterate over.
		 * @param {Function} callback The function that gets called for every array
		 * item.
		 * @returns {Array} A new array of values returned by the callback function.
		 */
		function map(array, fn) {
			var length = array.length;
			var result = [];
			while (length--) {
				result[length] = fn(array[length]);
			}
			return result;
		}

		/**
		 * A simple `Array#map`-like wrapper to work with domain name strings or email
		 * addresses.
		 * @private
		 * @param {String} domain The domain name or email address.
		 * @param {Function} callback The function that gets called for every
		 * character.
		 * @returns {Array} A new string of characters returned by the callback
		 * function.
		 */
		function mapDomain(string, fn) {
			var parts = string.split('@');
			var result = '';
			if (parts.length > 1) {
				// In email addresses, only the domain name should be punycoded. Leave
				// the local part (i.e. everything up to `@`) intact.
				result = parts[0] + '@';
				string = parts[1];
			}
			// Avoid `split(regex)` for IE8 compatibility. See #17.
			string = string.replace(regexSeparators, '\x2E');
			var labels = string.split('.');
			var encoded = map(labels, fn).join('.');
			return result + encoded;
		}

		/**
		 * Creates an array containing the numeric code points of each Unicode
		 * character in the string. While JavaScript uses UCS-2 internally,
		 * this function will convert a pair of surrogate halves (each of which
		 * UCS-2 exposes as separate characters) into a single code point,
		 * matching UTF-16.
		 * @see `punycode.ucs2.encode`
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode.ucs2
		 * @name decode
		 * @param {String} string The Unicode input string (UCS-2).
		 * @returns {Array} The new array of code points.
		 */
		function ucs2decode(string) {
			var output = [],
			    counter = 0,
			    length = string.length,
			    value,
			    extra;
			while (counter < length) {
				value = string.charCodeAt(counter++);
				if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
					// high surrogate, and there is a next character
					extra = string.charCodeAt(counter++);
					if ((extra & 0xFC00) == 0xDC00) { // low surrogate
						output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
					} else {
						// unmatched surrogate; only append this code unit, in case the next
						// code unit is the high surrogate of a surrogate pair
						output.push(value);
						counter--;
					}
				} else {
					output.push(value);
				}
			}
			return output;
		}

		/**
		 * Creates a string based on an array of numeric code points.
		 * @see `punycode.ucs2.decode`
		 * @memberOf punycode.ucs2
		 * @name encode
		 * @param {Array} codePoints The array of numeric code points.
		 * @returns {String} The new Unicode string (UCS-2).
		 */
		function ucs2encode(array) {
			return map(array, function(value) {
				var output = '';
				if (value > 0xFFFF) {
					value -= 0x10000;
					output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
					value = 0xDC00 | value & 0x3FF;
				}
				output += stringFromCharCode(value);
				return output;
			}).join('');
		}

		/**
		 * Converts a basic code point into a digit/integer.
		 * @see `digitToBasic()`
		 * @private
		 * @param {Number} codePoint The basic numeric code point value.
		 * @returns {Number} The numeric value of a basic code point (for use in
		 * representing integers) in the range `0` to `base - 1`, or `base` if
		 * the code point does not represent a value.
		 */
		function basicToDigit(codePoint) {
			if (codePoint - 48 < 10) {
				return codePoint - 22;
			}
			if (codePoint - 65 < 26) {
				return codePoint - 65;
			}
			if (codePoint - 97 < 26) {
				return codePoint - 97;
			}
			return base;
		}

		/**
		 * Converts a digit/integer into a basic code point.
		 * @see `basicToDigit()`
		 * @private
		 * @param {Number} digit The numeric value of a basic code point.
		 * @returns {Number} The basic code point whose value (when used for
		 * representing integers) is `digit`, which needs to be in the range
		 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
		 * used; else, the lowercase form is used. The behavior is undefined
		 * if `flag` is non-zero and `digit` has no uppercase form.
		 */
		function digitToBasic(digit, flag) {
			//  0..25 map to ASCII a..z or A..Z
			// 26..35 map to ASCII 0..9
			return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
		}

		/**
		 * Bias adaptation function as per section 3.4 of RFC 3492.
		 * http://tools.ietf.org/html/rfc3492#section-3.4
		 * @private
		 */
		function adapt(delta, numPoints, firstTime) {
			var k = 0;
			delta = firstTime ? floor(delta / damp) : delta >> 1;
			delta += floor(delta / numPoints);
			for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
				delta = floor(delta / baseMinusTMin);
			}
			return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
		}

		/**
		 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
		 * symbols.
		 * @memberOf punycode
		 * @param {String} input The Punycode string of ASCII-only symbols.
		 * @returns {String} The resulting string of Unicode symbols.
		 */
		function decode(input) {
			// Don't use UCS-2
			var output = [],
			    inputLength = input.length,
			    out,
			    i = 0,
			    n = initialN,
			    bias = initialBias,
			    basic,
			    j,
			    index,
			    oldi,
			    w,
			    k,
			    digit,
			    t,
			    /** Cached calculation results */
			    baseMinusT;

			// Handle the basic code points: let `basic` be the number of input code
			// points before the last delimiter, or `0` if there is none, then copy
			// the first basic code points to the output.

			basic = input.lastIndexOf(delimiter);
			if (basic < 0) {
				basic = 0;
			}

			for (j = 0; j < basic; ++j) {
				// if it's not a basic code point
				if (input.charCodeAt(j) >= 0x80) {
					error('not-basic');
				}
				output.push(input.charCodeAt(j));
			}

			// Main decoding loop: start just after the last delimiter if any basic code
			// points were copied; start at the beginning otherwise.

			for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

				// `index` is the index of the next character to be consumed.
				// Decode a generalized variable-length integer into `delta`,
				// which gets added to `i`. The overflow checking is easier
				// if we increase `i` as we go, then subtract off its starting
				// value at the end to obtain `delta`.
				for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

					if (index >= inputLength) {
						error('invalid-input');
					}

					digit = basicToDigit(input.charCodeAt(index++));

					if (digit >= base || digit > floor((maxInt - i) / w)) {
						error('overflow');
					}

					i += digit * w;
					t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

					if (digit < t) {
						break;
					}

					baseMinusT = base - t;
					if (w > floor(maxInt / baseMinusT)) {
						error('overflow');
					}

					w *= baseMinusT;

				}

				out = output.length + 1;
				bias = adapt(i - oldi, out, oldi == 0);

				// `i` was supposed to wrap around from `out` to `0`,
				// incrementing `n` each time, so we'll fix that now:
				if (floor(i / out) > maxInt - n) {
					error('overflow');
				}

				n += floor(i / out);
				i %= out;

				// Insert `n` at position `i` of the output
				output.splice(i++, 0, n);

			}

			return ucs2encode(output);
		}

		/**
		 * Converts a string of Unicode symbols (e.g. a domain name label) to a
		 * Punycode string of ASCII-only symbols.
		 * @memberOf punycode
		 * @param {String} input The string of Unicode symbols.
		 * @returns {String} The resulting Punycode string of ASCII-only symbols.
		 */
		function encode(input) {
			var n,
			    delta,
			    handledCPCount,
			    basicLength,
			    bias,
			    j,
			    m,
			    q,
			    k,
			    t,
			    currentValue,
			    output = [],
			    /** `inputLength` will hold the number of code points in `input`. */
			    inputLength,
			    /** Cached calculation results */
			    handledCPCountPlusOne,
			    baseMinusT,
			    qMinusT;

			// Convert the input in UCS-2 to Unicode
			input = ucs2decode(input);

			// Cache the length
			inputLength = input.length;

			// Initialize the state
			n = initialN;
			delta = 0;
			bias = initialBias;

			// Handle the basic code points
			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue < 0x80) {
					output.push(stringFromCharCode(currentValue));
				}
			}

			handledCPCount = basicLength = output.length;

			// `handledCPCount` is the number of code points that have been handled;
			// `basicLength` is the number of basic code points.

			// Finish the basic string - if it is not empty - with a delimiter
			if (basicLength) {
				output.push(delimiter);
			}

			// Main encoding loop:
			while (handledCPCount < inputLength) {

				// All non-basic code points < n have been handled already. Find the next
				// larger one:
				for (m = maxInt, j = 0; j < inputLength; ++j) {
					currentValue = input[j];
					if (currentValue >= n && currentValue < m) {
						m = currentValue;
					}
				}

				// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
				// but guard against overflow
				handledCPCountPlusOne = handledCPCount + 1;
				if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
					error('overflow');
				}

				delta += (m - n) * handledCPCountPlusOne;
				n = m;

				for (j = 0; j < inputLength; ++j) {
					currentValue = input[j];

					if (currentValue < n && ++delta > maxInt) {
						error('overflow');
					}

					if (currentValue == n) {
						// Represent delta as a generalized variable-length integer
						for (q = delta, k = base; /* no condition */; k += base) {
							t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
							if (q < t) {
								break;
							}
							qMinusT = q - t;
							baseMinusT = base - t;
							output.push(
								stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
							);
							q = floor(qMinusT / baseMinusT);
						}

						output.push(stringFromCharCode(digitToBasic(q, 0)));
						bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
						delta = 0;
						++handledCPCount;
					}
				}

				++delta;
				++n;

			}
			return output.join('');
		}

		/**
		 * Converts a Punycode string representing a domain name or an email address
		 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
		 * it doesn't matter if you call it on a string that has already been
		 * converted to Unicode.
		 * @memberOf punycode
		 * @param {String} input The Punycoded domain name or email address to
		 * convert to Unicode.
		 * @returns {String} The Unicode representation of the given Punycode
		 * string.
		 */
		function toUnicode(input) {
			return mapDomain(input, function(string) {
				return regexPunycode.test(string)
					? decode(string.slice(4).toLowerCase())
					: string;
			});
		}

		/**
		 * Converts a Unicode string representing a domain name or an email address to
		 * Punycode. Only the non-ASCII parts of the domain name will be converted,
		 * i.e. it doesn't matter if you call it with a domain that's already in
		 * ASCII.
		 * @memberOf punycode
		 * @param {String} input The domain name or email address to convert, as a
		 * Unicode string.
		 * @returns {String} The Punycode representation of the given domain name or
		 * email address.
		 */
		function toASCII(input) {
			return mapDomain(input, function(string) {
				return regexNonASCII.test(string)
					? 'xn--' + encode(string)
					: string;
			});
		}

		/*--------------------------------------------------------------------------*/

		/** Define the public API */
		punycode = {
			/**
			 * A string representing the current Punycode.js version number.
			 * @memberOf punycode
			 * @type String
			 */
			'version': '1.3.2',
			/**
			 * An object of methods to convert from JavaScript's internal character
			 * representation (UCS-2) to Unicode code points, and back.
			 * @see <https://mathiasbynens.be/notes/javascript-encoding>
			 * @memberOf punycode
			 * @type Object
			 */
			'ucs2': {
				'decode': ucs2decode,
				'encode': ucs2encode
			},
			'decode': decode,
			'encode': encode,
			'toASCII': toASCII,
			'toUnicode': toUnicode
		};

		/** Expose `punycode` */
		// Some AMD build optimizers, like r.js, check for specific condition patterns
		// like the following:
		if (
			true
		) {
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
				return punycode;
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (freeExports && freeModule) {
			if (module.exports == freeExports) { // in Node.js or RingoJS v0.8.0+
				freeModule.exports = punycode;
			} else { // in Narwhal or RingoJS v0.7.0-
				for (key in punycode) {
					punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
				}
			}
		} else { // in Rhino or a web browser
			root.punycode = punycode;
		}

	}(this));
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(26)(module), (function() { return this; }())))

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ }
/******/ ])