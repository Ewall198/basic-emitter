
class BasicEmitter {
    /**
     * Allows for subscription and unsubscription to events.
     */
    constructor() {
        this._listeners = {}; // {eventName: [listener, ..]}
    }

    /**
     * Register a listener for eventName.
     * @param {String} eventName 
     * @param {Function} listener 
     */
    addEventListener(eventName, listener) {
        if(!this._listeners.hasOwnProperty(eventName)) {
            this._listeners[eventName] = []
        }
        this._listeners[eventName].push(listener);
    }

    /**
     * Remove the last occurrence of listener from listeners to eventName.
     * @param {String} eventName 
     * @param {Function} listener 
     */
    removeEventListener(eventName, listener) {
        if(this._listeners.hasOwnProperty(eventName)) {
            let index = this._listeners[eventName].lastIndexOf(listener);
            if(index != -1) {
                this._listeners[eventName].splice(index, 1);
            }
        }
    }

    /** 
     * Trigger listeners to eventName and pass key details.
     * @param {String} eventName 
     * @param {*} args 
     * @return {Array} responses from all listeners.
     */
    fire(eventName, ...args) {
        let details = {
            context: this,
            eventName,
            args
        };

        let responses = [];

        if(this._listeners.hasOwnProperty(eventName)) {
            for(let listener of this._listeners[eventName]) {
                responses.push(listener(details));
            }
        }

        return responses;
    }
}

module.exports = {
    BasicEmitter
};