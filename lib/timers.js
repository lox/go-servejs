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
