/** 
 * @param {String} baseEventName // Defaults to the name of the function being wrapped.
 * @param {String} prependEventName // eventName = prependEventName + baseEventName.
 * @param {Function} // Function wrapper that will fire an event every time the underlying function is called.
 */
function _eventWrapper(prependEventName, baseEventName=null, wrappedFunc) {
    const wrapper = (target, name, descriptor) => {
        baseEventName = baseEventName || name;
        const eventName = prependEventName + baseEventName;
        const func = descriptor.value;
        function _wrappedFunc (...args) {
            return wrappedFunc.apply(this, [eventName, func, ...args]);
            // return wrappedFunc(this, eventName, func, ...args);
        }
        descriptor.value = _wrappedFunc;
        // descriptor.value = wrappedFunc.bind(null, target, eventName, func);
    }
    return wrapper;
}

/** Creates a wrapper which will fire event: 'before' + eventName before the function is called.
 * @param {String} baseEventName The name of the event that gets fired. Defaults to name of wrapped function.
 * @returns {Function} Function wrapper.
 */
function before(baseEventName=null) {
    function wrappedFunc(eventName, func, ...args) {
        this.fire.apply(this, [eventName, ...args]);
        return func.apply(this, args);
    }
    return _eventWrapper(
        'before',
        baseEventName,
        wrappedFunc
    );
}

/** Creates a wrapper which will fire event: 'after' + eventName after the function is called.
 * @param {String} baseEventName The name of the event that gets fired. Defaults to name of wrapped function.
 * @returns {Function} Function wrapper.
 */
function after(baseEventName=null) {
    function wrappedFunc(eventName, func, ...args) {
        setTimeout(() => {this.fire.apply(this, [eventName, ...args])}, 1);
        return func.apply(this, args);
    }
    return _eventWrapper(
        'after',
        baseEventName,
        wrappedFunc
    );
}

/** Creates a wrapper which will fire event: 'should' + eventName before the function is called.
 *      If any listeners return false then the wrapped function will not be called. 
 *      It is suggested that this be the top level event decorator.
 * @param {String} baseEventName The name of the event that gets fired. Defaults to name of wrapped function.
 * @returns {Function} Function wrapper.
 */
function should(baseEventName=null) {
    function wrappedFunc(eventName, func, ...args) {
        let fireResponses = this.fire.apply(this, [eventName, ...args]);
        let shouldCallFunc = fireResponses.every(val => val != false);
        if(shouldCallFunc) {
            return func.apply(this, args);
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