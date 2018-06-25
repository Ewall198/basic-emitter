/** 
 * @param {String} baseEventName // Defaults to the name of the function being wrapped.
 * @param {String} prependEventName // eventName = prependEventName + baseEventName.
 * @param {Function} // Function wrapper that will fire an event every time the underlying function is called.
 */
function _eventWrapper(prependEventName, baseEventName=null, wrappedFunc) {
    const wrapper = (target, name, descriptor) => {
        baseEventName = baseEventName || name;
        const eventName = prependEventName + baseEventName;
        const func = target[name];
        function _wrappedFunc (...args) {
            return wrappedFunc(this, eventName, func, ...args);
        }
        descriptor.value = _wrappedFunc;
        // descriptor.value = wrappedFunc.bind(null, target, eventName, func);
    }
    return wrapper;
}

/** Creates a wrapper which will fire event: 'before' + eventName any time the function is called.
 * @param {String} baseEventName The name of the event that gets fire. Defaults to name of wrapped function.
 * @returns {Function} Function wrapper.
 */
function before(baseEventName=null) {
    function wrappedFunc(target, eventName, func, ...args) {
        target.fire(eventName, ...args);
        return func(...args);
    }
    return _eventWrapper(
        'before',
        baseEventName,
        wrappedFunc
    );
}

function after(baseEventName=null) {
    function wrappedFunc(target, eventName, func, ...args) {
        setTimeout(() => {target.fire(eventName, ...args)}, 1);
        return func(...args);
    }
    return _eventWrapper(
        'after',
        baseEventName,
        wrappedFunc
    );
}


function should(baseEventName=null) {
    function wrappedFunc(target, eventName, func, ...args) {
        let fireResponses = target.fire(eventName, ...args);
        let shouldCallFunc = fireResponses.every(val => val != false);
        if(shouldCallFunc) {
            return func(...args);
        }
    }
    return _eventWrapper(
        'should',
        baseEventName,
        wrappedFunc
    );
}

module.exports = {
    before,
    after,
    should
}